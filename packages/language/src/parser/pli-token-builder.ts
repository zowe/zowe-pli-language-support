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
    const id = terminalTokens.find((e) => e.name === "ID")!;

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
    const execFragment = tokens.find((e) => e.name === "ExecFragment")!;
    execFragment.START_CHARS_HINT = ["S", "C"];
    
    return tokens.map(t => this.makeSticky(t));
  }

  private makeSticky(tokenType: TokenType): TokenType {
    if (tokenType.PATTERN instanceof RegExp) {
        return {
            ...tokenType,
            PATTERN: new RegExp(tokenType.PATTERN.source, `${tokenType.PATTERN.flags}y`)
        }
    }
    return tokenType;
  }
}