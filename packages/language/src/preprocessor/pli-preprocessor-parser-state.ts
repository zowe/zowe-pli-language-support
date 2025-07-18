/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { tokenMatcher, TokenType } from "chevrotain";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import {
  Mutators,
  PliPreprocessorLexerState,
  PreprocessorLexerState,
} from "./pli-preprocessor-lexer-state";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PreprocessorError } from "./pli-preprocessor-error";
import { SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI } from "../utils/uri";
import { Token } from "../parser/tokens";

type ParserLocation = "in-statement" | "in-procedure";

export interface PreprocessorParserState {
  index: number;
  uri: URI;
  get tokens(): Token[];
  get current(): Token | undefined;
  get last(): Token | undefined;
  get eof(): boolean;

  canConsume(...tokenType: TokenType[]): boolean;
  tryConsume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): boolean;
  consume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token;

  canConsumeKeyword(...tokenTypes: TokenType[]): boolean;
  tryConsumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): boolean;
  consumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token;

  advanceLines(lineCount: number): void;
  push(location: ParserLocation): void;
  pop(): void;
  isOnlyInStatement(): boolean;
  isInProcedure(): boolean;
  lookahead(la: number): Token | undefined;
  addInclude(uri: URI): void;
  hasInclude(uri: URI): boolean;
}

export class PliPreprocessorParserState implements PreprocessorParserState {
  private readonly lexer: PliPreprocessorLexer;
  private readonly lexerState: PreprocessorLexerState;
  readonly tokens: Token[];
  public index: number;
  public uri: URI;
  private text: string;
  private location: ParserLocation[] = [];
  private includes: Set<string> = new Set();

  constructor(lexer: PliPreprocessorLexer, text: string, uri: URI) {
    this.lexer = lexer;
    this.lexerState = new PliPreprocessorLexerState(text, uri);
    this.text = text;
    this.tokens = this.lexer.tokenize(this.lexerState);
    this.index = 0;
    this.uri = uri;
  }

  lookahead(la: number): Token | undefined {
    const index = this.index + la - 1;
    return this.tokens[index];
  }

  advanceLines(lineCount: number): void {
    if (!this.current) {
      return;
    }
    const newPosition = Mutators.advanceLines(
      this.current.startOffset,
      this.text,
      lineCount,
    );
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token.startOffset >= newPosition) {
        break;
      }
      this.index++;
    }
  }
  push(location: ParserLocation): void {
    this.location.push(location);
  }
  top(): ParserLocation | undefined {
    if (this.location.length > 0) {
      return this.location[this.location.length - 1];
    }
    return undefined;
  }
  pop(): void {
    this.location.pop();
  }

  get current() {
    return this.tokens[this.index];
  }

  get last() {
    return this.eof
      ? this.tokens.length === 0
        ? undefined
        : this.tokens[this.tokens.length - 1]
      : this.tokens[this.index - 1];
  }

  get eof() {
    return this.index >= this.tokens.length;
  }

  canConsume(...tokenTypes: TokenType[]) {
    if (this.index + tokenTypes.length - 1 >= this.tokens.length) {
      return false;
    }
    for (let i = 0; i < tokenTypes.length; i++) {
      const token = this.tokens[this.index + i];
      if (!token) {
        return false;
      }
      if (!tokenMatcher(token, tokenTypes[i])) {
        return false;
      }
    }
    return true;
  }

  isOnlyInStatement() {
    return (
      this.location.length === 0 ||
      this.location.every((l) => l === "in-statement")
    );
  }

  isInProcedure() {
    return this.location.some((l) => l === "in-procedure");
  }

  tryConsume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): boolean {
    if (!this.canConsume(tokenType)) {
      return false;
    }
    this.current!.payload = {
      uri: this.uri,
      kind,
      element,
    };
    this.index++;
    return true;
  }

  consume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ) {
    const token = this.current!;
    if (!this.canConsume(tokenType)) {
      const actualTokenTypes = this.tokens
        .slice(this.index, this.index + 1)
        .map((t) => t.tokenType.name ?? "???")
        .join(", ");
      const message = `Expected token type '${tokenType.name}', got '${actualTokenTypes}' instead.`;
      throw new PreprocessorError(message, token || this.last, this.uri);
    }
    token.payload = {
      uri: this.uri,
      kind,
      element,
    };
    this.index++;
    return token;
  }

  canConsumeKeyword(...tokenTypes: TokenType[]): boolean {
    if (!this.isInProcedure()) {
      tokenTypes = [PreprocessorTokens.Percentage, ...tokenTypes];
    }
    return this.canConsume(...tokenTypes);
  }

  tryConsumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): boolean {
    const percentage = !this.isInProcedure();
    const start = this.index;
    if (percentage) {
      if (!this.canConsume(PreprocessorTokens.Percentage)) {
        return false;
      }
      this.index++;
    }
    if (!this.canConsume(tokenType)) {
      this.index = start;
      return false;
    }
    this.index = start;
    if (percentage) {
      this.consume(
        element,
        CstNodeKind.Percentage,
        PreprocessorTokens.Percentage,
      );
    }
    this.consume(element, kind, tokenType);
    return true;
  }

  consumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token {
    if (!this.isInProcedure()) {
      this.consume(
        element,
        CstNodeKind.Percentage,
        PreprocessorTokens.Percentage,
      );
    }
    return this.consume(element, kind, tokenType);
  }

  addInclude(uri: URI): void {
    this.includes.add(uri.toString());
  }

  hasInclude(uri: URI): boolean {
    return this.includes.has(uri.toString());
  }
}
