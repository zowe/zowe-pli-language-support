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

import {
  TokenType,
  Lexer as ChevrotainLexer,
  TokenTypeDictionary,
} from "chevrotain";
import {
  AllPreprocessorTokens,
} from "./pli-preprocessor-tokens";
import {
  PliSmartTokenPickerOptimizer,
  TokenPicker,
} from "./pli-token-picker-optimizer";
import { PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import * as tokens from "../parser/tokens";
import { Token } from "../parser/tokens";

export class PliPreprocessorLexer {
  private readonly vocabulary: TokenType[];
  public readonly tokenTypeDictionary: TokenTypeDictionary;
  public readonly hiddenTokenTypes: TokenType[];
  public readonly numberTokenType: TokenType;
  public readonly idTokenType: TokenType;
  public readonly normalTokenTypePicker: TokenPicker;

  constructor() {
    this.vocabulary = tokens.all;
    this.tokenTypeDictionary = {};
    for (const token of this.vocabulary) {
      this.tokenTypeDictionary[token.name] = token;
    }
    this.hiddenTokenTypes = this.vocabulary.filter(
      (v) => v.GROUP === ChevrotainLexer.SKIPPED,
    );
    this.numberTokenType = tokens.NUMBER;
    this.idTokenType = tokens.ID;
    this.normalTokenTypePicker =
      new PliSmartTokenPickerOptimizer().optimize(this.vocabulary);
  }

  skipHiddenTokens(state: PreprocessorLexerState) {
    while (
      this.hiddenTokenTypes.some((h) => state.tryConsume(h) !== undefined)
    );
  }

  tokenize(state: PreprocessorLexerState): Token[] {
    let token: Token | undefined = undefined;
    const list: Token[] = [];
    do {
      token = this.getNextPliToken(state);
      if (token) {
        // TODO: Ignore hidden tokens already here?
        list.push(token);
      }
    } while (token);
    return list;
  }

  tokenizePliTokensUntilSemicolon(state: PreprocessorLexerState): Token[] {
    let token: Token | undefined = undefined;
    const list: Token[] = [];
    do {
      token = this.getNextPliToken(state);
      if (token) {
        // TODO: Ignore hidden tokens already here?
        list.push(token);
      }
    } while (token && token.image !== ";");
    return list;
  }

  private getNextPliToken(state: PreprocessorLexerState): Token | undefined {
    if (state.eof()) {
      return undefined;
    }
    // TODO: Add ID based optimization:
    // I.e. only check for ID if the current char is a letter
    // Afterwards, check if the ID is a keyword
    // This is much faster than checking all the keyword tokens and then the ID token
    for (const tokenType of this.normalTokenTypePicker.pickTokenTypes(
      state.currentChar(),
    )) {
      const token = state.tryConsume(tokenType);
      if (!token) {
        continue;
      }
      return token;
    }
    return undefined;
  }

  tokenizePreprocessorTokensUntilSemicolon(state: PreprocessorLexerState) {
    const result: Token[] = [];
    let foundAny: boolean;
    do {
      foundAny = false;
      this.skipHiddenTokens(state);
      for (const tokenType of AllPreprocessorTokens) {
        const token = state.tryConsume(tokenType);
        if (token) {
          result.push(token);
          foundAny = true;
          if (token.image === ";") {
            return result;
          }
          break;
        }
      }
    } while (foundAny);
    return result;
  }
}
