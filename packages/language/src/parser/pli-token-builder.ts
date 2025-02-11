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

import { TokenType, TokenVocabulary } from "chevrotain";
import {
  DefaultTokenBuilder,
  Grammar,
  GrammarUtils,
  RegExpUtils,
  stream,
  TokenBuilderOptions,
} from "langium";

export class PliTokenBuilder extends DefaultTokenBuilder {
  or: string = "|";
  not: string = "¬";

  /**
   * Flag to enable experimental lexer/parser features.
   *
   * Enables the dynamic generation of tokens for the OR and NOT operators.
   *
   * `false` by default.
   */
  static EXPERIMENTAL = true;

  override buildTokens(
    grammar: Grammar,
    options?: TokenBuilderOptions,
  ): TokenVocabulary {
    const reachableRules = stream(
      GrammarUtils.getAllReachableRules(grammar, false),
    );
    const terminalTokens: TokenType[] =
      this.buildTerminalTokens(reachableRules);
    const tokens: TokenType[] = this.buildKeywordTokens(
      reachableRules,
      terminalTokens,
      options,
    );
    const id = this.findToken(terminalTokens, "ID");

    for (const keywordToken of tokens) {
      if (/[a-zA-Z]/.test(keywordToken.name)) {
        keywordToken.CATEGORIES = [id];
      }
    }

    terminalTokens.forEach((terminalToken) => {
      const pattern = terminalToken.PATTERN;
      if (
        (typeof pattern === "object" &&
          pattern &&
          "test" in pattern &&
          RegExpUtils.isWhitespace(pattern)) ||
        terminalToken.name === "ExecFragment"
      ) {
        tokens.unshift(terminalToken);
      } else {
        tokens.push(terminalToken);
      }
    });
    const execFragment = this.findToken(tokens, "ExecFragment");
    execFragment.START_CHARS_HINT = ["S", "C"];
    if (PliTokenBuilder.EXPERIMENTAL) {
      this.overrideNotTokens(tokens);
      this.overrideOrTokens(tokens);
    }
    return tokens;
  }

  protected overrideOrTokens(token: TokenType[]): void {
    this.overrideToken(this.findToken(token, "OR_TOKEN"), "", () =>
      this.getOr(),
    );
    this.overrideToken(this.findToken(token, "OR_EQUAL"), "=", () =>
      this.getOr(),
    );
    this.overrideToken(this.findToken(token, "CONCAT_TOKEN"), "", () =>
      this.getOr(true),
    );
    this.overrideToken(this.findToken(token, "CONCAT_EQUAL"), "=", () =>
      this.getOr(true),
    );
  }

  protected overrideNotTokens(token: TokenType[]): void {
    this.overrideToken(this.findToken(token, "NOT_TOKEN"), "", () =>
      this.getNot(),
    );
    this.overrideToken(this.findToken(token, "NOT_SMALLER"), "<", () =>
      this.getNot(),
    );
    this.overrideToken(this.findToken(token, "NOT_EQUAL"), "=", () =>
      this.getNot(),
    );
    this.overrideToken(this.findToken(token, "NOT_LARGER"), ">", () =>
      this.getNot(),
    );
  }

  private getOr(double?: boolean): string {
    const value = this.or.charAt(0);
    return double ? value + value : value;
  }

  private getNot(): string {
    return this.not.charAt(0);
  }

  private findToken(tokens: TokenType[], name: string): TokenType {
    return tokens.find((e) => e.name === name)!;
  }

  private overrideToken(
    token: TokenType,
    end: string,
    override: () => string,
  ): void {
    token.PATTERN = (text, offset) => {
      const value = override() + end;
      const check = text.substring(offset, offset + value.length);
      if (check === value) {
        return [check];
      } else {
        return null;
      }
    };
    token.START_CHARS_HINT = ["!", "|", "^", "¬"];
  }
}
