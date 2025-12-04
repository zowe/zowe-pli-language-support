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
import { SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import * as t from "./tokens";
import {
  diagnostic,
  Diagnostic,
  diagnosticFromCode,
  Severity,
} from "../language-server/types";
import { RuleMap } from "./parser-types";
import {
  isParametricPLICode,
  isSimplePLICode,
  ParametricPLICode,
  PLICodes,
  SimplePLICode,
} from "../validation/pli-codes";

export function preprocessorParserState(tokens: t.Token[]): ParserState {
  return new ParserState(tokens, ParserStateMode.Preprocessor);
}

export function finalParserState(tokens: t.Token[]): ParserState {
  return new ParserState(tokens, ParserStateMode.Final);
}

export enum ParserStateMode {
  Preprocessor,
  Final,
}

export class ParserState {
  readonly tokens: t.Token[];
  readonly mode: ParserStateMode;
  readonly diagnostics: Diagnostic[];
  public index: number;
  public inError = false;

  private inProcedure = false;

  constructor(tokens: t.Token[], mode: ParserStateMode) {
    this.tokens = tokens;
    this.mode = mode;
    this.diagnostics = [];
    this.index = 0;
  }

  createLoopContext(id: number = 1) {
    const regex = /parser\-handwritten\.ts:(\d+)/;
    const stack = new Error().stack!.split("\n");
    const location = stack.find(line => regex.test(line))!;
    const match = location.match(regex)![1]+` (loop id: ${id})`;
    let lastIndex = -1;
    return {
      inc: () => {
        if(lastIndex === this.index) {
          ///this.inError = true;
          throw new Error(`Possible infinite loop detected in parser at ${match} after ${this.token?.image} token.`);
        }
        lastIndex = this.index;
      }
    }
  }

  enterProcedure(): void {
    this.inProcedure = true;
  }

  leaveProcedure(): void {
    this.inProcedure = false;
  }

  /**
   * Peeks into the token stream without consuming any tokens.
   *
   * @param la The lookahead distance (in tokens). 1 means the current token, 2 means the next token after that, etc.
   * @returns The token at the specified lookahead distance, or undefined if out of bounds
   */
  peek(la: number): t.Token | undefined {
    const index = this.index + la - 1;
    return this.tokens[index];
  }

  get token(): t.Token | undefined {
    return this.tokens[this.index];
  }

  get last(): t.Token | undefined {
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
  error(message?: string, token?: t.Token, severity?: Severity): void;
  error(message: SimplePLICode, token?: t.Token): void;
  error<T extends ParametricPLICode>(
    message: T,
    args: Parameters<T["message"]>,
    token?: t.Token,
  ): void;
  error(
    message?: string | SimplePLICode | ParametricPLICode,
    tokenOrArgs?: t.Token | Parameters<ParametricPLICode["message"]>,
    tokenOrSeverity?: t.Token | Severity,
  ) {
    if (this.inError) {
      return;
    }
    if (!message || typeof message === "string") {
      // We have a simple string message (or none at all)
      const token = (tokenOrArgs || this.token || this.last) as
        | t.Token
        | undefined;
      const severity = (tokenOrSeverity || Severity.S) as Severity;
      const msg =
        message ??
        // Generate our own simple message
        (this.eof
          ? "Unexpected end of file."
          : `Unexpected token '${generateTokenErrorName(token)}'.`);
      this.diagnostics.push(diagnostic(severity, msg, token));
    } else if (isParametricPLICode(message)) {
      // Cast the args and token parameters to fit with the parametric code signature
      const args = tokenOrArgs as Parameters<ParametricPLICode["message"]>;
      const token = (tokenOrSeverity || this.token || this.last) as
        | t.Token
        | undefined;
      this.diagnostics.push(diagnosticFromCode(message, token, ...args));
    } else if (isSimplePLICode(message)) {
      // Cast the token parameter to fit with the simple code signature
      const token = (tokenOrArgs || this.token || this.last) as
        | t.Token
        | undefined;
      this.diagnostics.push(diagnosticFromCode(message, token));
    }
    this.inError = true;
  }

  recover(): void {
    if (!this.inError) {
      // Prevent error recovery if not in error state.
      return;
    }
    if (this.mode === ParserStateMode.Preprocessor) {
      this.performPreprocessorRecovery();
    } else if (this.mode === ParserStateMode.Final) {
      this.performMainParserRecovery();
    }
    this.inError = false;
  }

  private performMainParserRecovery(): void {
    const currentLine = (this.token || this.last)?.startLine ?? 0;
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (token.startLine !== currentLine) {
        // Moved to next line, stop here
        break;
      } else if (tokenMatcher(token, t.Semicolon)) {
        this.index++;
        break;
      } else {
        this.index++;
      }
    }
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
      } else if (tokenMatcher(token, t.Semicolon)) {
        this.index++;
        break;
      } else if (tokenMatcher(token, t.Percent)) {
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
  ): t.Token | null {
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
  ): t.Token | null;
  consume<T extends ParametricPLICode>(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
    code: T,
    ...args: Parameters<T["message"]>
  ): t.Token | null;
  consume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
    code: SimplePLICode,
  ): t.Token | null;
  consume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
    code?: SimplePLICode | ParametricPLICode,
    ...args: any[]
  ): t.Token | null {
    const token = this.token;
    if (!token || !this.canConsume(tokenType)) {
      if (this.inError) {
        return null;
      }
      if (code) {
        if (isParametricPLICode(code)) {
          this.error(code, args || [], token);
        } else {
          this.error(code, token);
        }
      } else {
        const message = `Expected token "${tokenType.name}", but received ${generateTokenErrorName(token)} instead.`;
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
    const withPercent = this.canConsume(t.Percent, ...tokenTypes);
    if (this.isInProcedure()) {
      // In a procedure, we should only consume the tokens if there's no percentage sign
      // However, if there's a percentage sign, we should still return true to indicate
      // that the tokens can be consumed, and then show an error on the percent token
      return withPercent || this.canConsume(...tokenTypes);
    } else {
      return withPercent;
    }
  }

  tryConsumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): t.Token | null {
    if (this.canConsumeKeyword(tokenType)) {
      return this.consumeKeyword(element, kind, tokenType);
    } else {
      return null;
    }
  }

  consumeKeyword(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): t.Token | null {
    if (!this.isInProcedure()) {
      // If were outside of a procedure, we must have a percent token
      this.consume(element, CstNodeKind.Percentage, t.Percent);
    } else if (this.canConsume(t.Percent)) {
      // If we're inside a procedure, there shouldn't be a percent token
      // but if there is one, consume it and show an error
      const percent = this.consume(element, CstNodeKind.Percentage, t.Percent);
      this.diagnostics.push(
        diagnosticFromCode(PLICodes.Severe.IBM3762I, percent),
      );
    }
    return this.consume(element, kind, tokenType);
  }

  private mapMatch(map: RuleMap, tokenType: TokenType): number|undefined {
    return [tokenType.tokenTypeIdx??-1, ...(tokenType.CATEGORIES??[]).map(cat => cat.tokenTypeIdx??-1)]
      .find(index => map.has(index));
  }

  private canConsumeFirstItem(map: RuleMap, index: number): boolean {
    if(this.index + index >= this.tokens.length) {
      return false;
    }
    const tokenType = this.tokens[this.index+index].tokenType;
    const idx = this.mapMatch(map, tokenType);
    if(idx === undefined) {
      return false;
    }
    const next = map.get(idx)!;
    if(next instanceof Function) {
      return true;
    } else {
      return this.canConsumeFirstItem(next, index+1);
    }
  }

  canConsumeFirst(firstSet: RuleMap): boolean {
    return this.canConsumeFirstItem(firstSet, 0);
  }

  private consumeAlternativesItem<T>(map: RuleMap<T>, index: number): T|null {
    if(this.eof || this.inError) {
      return null;
    }
    const token = this.tokens[this.index + index];
    const lookahead = token.tokenType;
    const idx = this.mapMatch(map, lookahead);
    if(idx === undefined) {
      //TODO this.error(`Expected '', but found '${lookahead.name}'.`, token, Severity.S)
      this.inError = true;
      return null;
    }
    const next = map.get(idx)!;
    if(next instanceof Function) {
      return next(this);
    } else {
      return this.consumeAlternativesItem(next, index+1);
    }
  }

  consumeAlternatives<T>(map: RuleMap<T>): T|null {
    return this.consumeAlternativesItem(map, 0);
  }
}

export function generateTokenErrorName(token: t.Token | undefined): string {
  if (!token) {
    return "end of file";
  } else {
    return `"${token.image}"`;
  }
}
