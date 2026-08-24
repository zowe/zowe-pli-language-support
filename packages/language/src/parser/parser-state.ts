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
import { SyntaxNode, LabelPrefix } from "../syntax-tree/ast";
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
import { tokenIdxToClass } from "./token-type-factory";
import * as environment from "../workspace/environment";
import { CompilerOptions } from "../preprocessor/compiler-options/options";

export enum RecoveryResult {
  /**
   * Recover at the current token
   */
  Recover,
  /**
   * Recover after the current token
   */
  RecoverNext,
  /**
   * Continue the recovery process (the parser state will go on to the next token)
   */
  Continue,
}

export type RecoveryFunction = () => RecoveryResult;

const NOOP_LOOP_CONTEXT = {
  inc: () => {
    /* nothing to do */
  },
};

export class ParserState {
  readonly tokens: t.Token[];
  readonly diagnostics: Diagnostic[];
  readonly compilerOptions?: CompilerOptions;
  private inProcedure = false;
  public index: number;
  public inError = false;
  public currentStatementLabels: LabelPrefix[] = [];

  constructor(tokens: t.Token[], compilerOptions?: CompilerOptions) {
    this.tokens = tokens;
    this.diagnostics = [];
    this.compilerOptions = compilerOptions;
    this.index = 0;
  }

  createLoopContext(name: string) {
    if (environment.IsDebugging) {
      let lastIndex = -1;
      return {
        inc: () => {
          if (lastIndex === this.index) {
            throw new Error(
              `Possible infinite loop detected in parser at rule ${name} after ${this.token?.image} token.`,
            );
          }
          lastIndex = this.index;
        },
      };
    }
    // Outside of debugging this is a no-op, and createLoopContext is called
    // several times per parsed statement - return a shared instance instead of
    // allocating a fresh closure each time.
    return NOOP_LOOP_CONTEXT;
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

  isEndOptional(): boolean {
    return this.compilerOptions?.rules?.multiClose ?? false;
  }

  endLabelMatches(endLabel: true | string): boolean {
    if (endLabel === true) {
      // Unlabeled END matches any statement
      return true;
    }
    return this.currentStatementLabels.some(
      (labelPrefix) => labelPrefix.item?.ref?.text === endLabel,
    );
  }

  /**
   * Emits a diagnostic without setting the parser in error state.
   * Use this for warnings, info diagnostics, or any diagnostic that shouldn't
   * trigger error recovery.
   */
  diagnostic(message: SimplePLICode, token?: t.Token): void;
  diagnostic<T extends ParametricPLICode>(
    message: T,
    args: Parameters<T["message"]>,
    token?: t.Token,
  ): void;
  diagnostic(
    message: SimplePLICode | ParametricPLICode,
    tokenOrArgs?: t.Token | Parameters<ParametricPLICode["message"]>,
    token?: t.Token,
  ): void {
    if (isParametricPLICode(message)) {
      // Cast the args and token parameters to fit with the parametric code signature
      const args = tokenOrArgs as Parameters<ParametricPLICode["message"]>;
      const finalToken = (token || this.token || this.last) as
        t.Token | undefined;
      this.diagnostics.push(diagnosticFromCode(message, finalToken, ...args));
    } else if (isSimplePLICode(message)) {
      // Cast the token parameter to fit with the simple code signature
      const finalToken = (tokenOrArgs || this.token || this.last) as
        t.Token | undefined;
      this.diagnostics.push(diagnosticFromCode(message, finalToken));
    }
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

    // Handle custom string messages (or default error when no message)
    if (!message || typeof message === "string") {
      const token = (tokenOrArgs || this.token || this.last) as
        t.Token | undefined;
      const severity = (tokenOrSeverity || Severity.S) as Severity;
      const msg =
        message ??
        (this.eof
          ? "Unexpected end of file."
          : `Unexpected token '${generateTokenErrorName(token)}'.`);
      this.diagnostics.push(diagnostic(severity, msg, token));
    } else if (isParametricPLICode(message)) {
      this.diagnostic(
        message,
        tokenOrArgs as Parameters<ParametricPLICode["message"]>,
        tokenOrSeverity as t.Token | undefined,
      );
    } else {
      this.diagnostic(message, tokenOrArgs as t.Token | undefined);
    }

    this.inError = true;
  }

  recover(fn: RecoveryFunction): void {
    if (!this.inError) {
      // Prevent error recovery if not in error state.
      return;
    }
    let state = RecoveryResult.Continue;
    while (
      this.index < this.tokens.length &&
      state === RecoveryResult.Continue
    ) {
      // Advance to the next token
      this.index++;
      state = fn();
    }
    if (state === RecoveryResult.RecoverNext) {
      this.index++;
    }
    this.inError = false;
  }

  /**
   * Resets the error state without performing any recovery.
   * This is particularly useful in the preprocessor, where we can simply parse "TokenStatement" elements
   */
  skipRecovery(): void {
    this.inError = false;
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

  canPercentConsume(...tokenTypes: TokenType[]): boolean {
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

  tryPercentConsume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): t.Token | null {
    if (this.canPercentConsume(tokenType)) {
      return this.percentConsume(element, kind, tokenType);
    } else {
      return null;
    }
  }

  /**
   * Consumes the given token type, handling the optional percent sign.
   *
   * Whether a percent sign is expected or not depends on whether the parser
   * is currently inside a procedure or not.
   */
  percentConsume(
    element: SyntaxNode | undefined,
    kind: CstNodeKind | undefined,
    tokenType: TokenType,
  ): t.Token | null {
    if (!this.isInProcedure()) {
      // If we're outside of a procedure, we must have a percent token
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

  private mapMatch(map: RuleMap, tokenType: TokenType): number | undefined {
    const tokenTypeIdx = tokenType.tokenTypeIdx ?? -1;
    if (map.has(tokenTypeIdx)) {
      return tokenTypeIdx;
    }
    if (tokenType.CATEGORIES) {
      for (const category of tokenType.CATEGORIES) {
        const categoryIdx = category.tokenTypeIdx ?? -1;
        if (map.has(categoryIdx)) {
          return categoryIdx;
        }
      }
    }
    return undefined;
  }

  private canConsumeFirstItem(map: RuleMap, index: number): boolean {
    if (this.inError || this.index + index >= this.tokens.length) {
      return false;
    }
    const tokenType = this.tokens[this.index + index].tokenType;
    const idx = this.mapMatch(map, tokenType);
    if (idx === undefined) {
      return false;
    }
    const next = map.get(idx)!;
    if (next instanceof Function) {
      return true;
    } else {
      return this.canConsumeFirstItem(next, index + 1);
    }
  }

  canConsumeFirst(firstSet: RuleMap): boolean {
    return this.canConsumeFirstItem(firstSet, 0);
  }

  private consumeAlternativesItem<T>(
    map: RuleMap<T>,
    index: number,
    args: any[],
  ): T | null {
    if (this.eof || this.inError) {
      return null;
    }
    const token = this.tokens[this.index + index];
    const lookahead = token.tokenType;
    const idx = this.mapMatch(map, lookahead);
    if (idx === undefined) {
      const tokenTypeNames = [...map.keys()]
        .map((idx) => tokenIdxToClass(idx))
        .filter((k) => k !== undefined)
        .map((tk) => tk!.name)
        .join(", ");
      this.error(
        `Expected any of {${tokenTypeNames}}, but found ${generateTokenErrorName(token)}.`,
        token,
        Severity.S,
      );
      return null;
    }
    const next = map.get(idx)!;
    if (next instanceof Function) {
      return next(this, ...args);
    } else {
      return this.consumeAlternativesItem(next, index + 1, args);
    }
  }

  consumeAlternatives<T, Args extends any[]>(
    map: RuleMap<T>,
    args: Args,
  ): T | null {
    return this.consumeAlternativesItem(map, 0, args);
  }
}

export function generateTokenErrorName(token: t.Token | undefined): string {
  if (!token) {
    return "end of file";
  } else {
    return `"${token.image}"`;
  }
}
