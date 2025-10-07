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
import { PreprocessorTokens } from "../preprocessor/pli-preprocessor-tokens";
import { SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { Token } from "./tokens";
import { diagnostic, Diagnostic, Severity } from "../language-server/types";

export function preprocessorParserState(tokens: Token[]): ParserState {
  return new ParserState(tokens, ParserStateMode.Preprocessor);
}

export function finalParserState(tokens: Token[]): ParserState {
  return new ParserState(tokens, ParserStateMode.Final);
}

export enum ParserStateMode {
  Preprocessor,
  Final,
}

export class ParserState {
  readonly tokens: Token[];
  readonly mode: ParserStateMode;
  readonly diagnostics: Diagnostic[];
  public index: number;
  public inError = false;

  private inProcedure = false;

  constructor(tokens: Token[], mode: ParserStateMode) {
    this.tokens = tokens;
    this.mode = mode;
    this.diagnostics = [];
    this.index = 0;
  }

  pushProcedure(): void {
    this.inProcedure = true;
  }

  popProcedure(): void {
    this.inProcedure = false;
  }

  lookahead(la: number): Token | undefined {
    const index = this.index + la - 1;
    return this.tokens[index];
  }

  get token(): Token | undefined {
    return this.tokens[this.index];
  }

  get last(): Token | undefined {
    return this.tokens[this.index - 1];
  }

  get eof(): boolean {
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

  isInProcedure() {
    return this.inProcedure;
  }

  /**
   * Generates an error diagnostic at the current token or the last token if at EOF
   * and sets the parser in error state to avoid multiple errors for the same issue.
   * The parser will try to continue parsing, but no further errors will be reported
   * until a successful consume() happens or the recover() method is called.
   */
  error(
    message?: string,
    token = this.token || this.last,
    severity = Severity.E,
  ) {
    if (!this.inError) {
      const msg =
        message ??
        (this.eof
          ? "Unexpected end of file."
          : `Unexpected token '${generateTokenErrorName(token)}'.`);
      this.diagnostics.push(diagnostic(severity, msg, token));
      this.inError = true;
    }
  }

  recover(): void {
    if (!this.inError) {
      // Prevent error recovery if not in error state.
      return;
    }
    if (this.mode === ParserStateMode.Preprocessor) {
      this.performPreprocessorRecovery();
    } else if (this.mode === ParserStateMode.Final) {
      // TODO: Implement error recovery for PLI parser
    }
    this.inError = false;
  }

  private performPreprocessorRecovery(): void {
    // If the preprocessor parser encounters an error, it should attempt to:
    // 1. Find a semicolon at the current line, and skip that token
    // 2. Find a percent sign at the current line, and stop
    // 3. If neither is found, skip to the next line
    const currentLine = (this.token || this.last)?.startLine ?? 0;
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token.startLine !== currentLine) {
        // Moved to next line, stop here
        break;
      } else if (tokenMatcher(token, PreprocessorTokens.Semicolon)) {
        this.index++;
        break;
      } else if (tokenMatcher(token, PreprocessorTokens.Percentage)) {
        break;
      } else {
        this.index++;
      }
    }
  }

  tryConsume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token | null {
    if (!this.canConsume(tokenType)) {
      return null;
    }
    const token = this.token!;
    token.kind = kind;
    token.element = element;
    this.index++;
    return token;
  }

  consume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token | null {
    const token = this.token;
    if (!token || !this.canConsume(tokenType)) {
      if (!this.inError) {
        const message = `Expected token '${tokenType.name}', but received ${generateTokenErrorName(token)} instead.`;
        this.error(message);
      }
      return null;
    } else {
      // Successful consume, reset error state
      this.inError = false;
      token.kind = kind;
      token.element = element;
      this.index++;
      return token;
    }
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
  ): Token | null {
    const percentage = !this.isInProcedure();
    const start = this.index;
    if (percentage) {
      if (!this.canConsume(PreprocessorTokens.Percentage)) {
        return null;
      }
      // Increment, so the next canConsume operates on the actual requested token type
      this.index++;
    }
    if (!this.canConsume(tokenType)) {
      this.index = start;
      return null;
    }
    this.index = start;
    if (percentage) {
      this.consume(
        element,
        CstNodeKind.Percentage,
        PreprocessorTokens.Percentage,
      );
    }
    return this.consume(element, kind, tokenType);
  }

  consumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): Token | null {
    if (!this.isInProcedure()) {
      this.consume(
        element,
        CstNodeKind.Percentage,
        PreprocessorTokens.Percentage,
      );
    }
    return this.consume(element, kind, tokenType);
  }
}

export function generateTokenErrorName(token: Token | undefined): string {
  if (!token) {
    return "end of file";
  } else {
    return `"${token.image}"`;
  }
}
