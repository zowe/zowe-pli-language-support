import {
  TokenType,
  Lexer as ChevrotainLexer,
  TokenTypeDictionary,
  IToken,
} from "chevrotain";
import {
  AllPreprocessorTokens,
  PreprocessorTokens,
} from "./pli-preprocessor-tokens";
import {
  TokenPicker,
  TokenPickerOptimizer,
} from "./pli-token-picker-optimizer";
import { PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import * as tokens from "../parser/tokens";

export class PliPreprocessorLexer {
  private readonly vocabulary: TokenType[];
  public readonly tokenTypeDictionary: TokenTypeDictionary;
  public readonly hiddenTokenTypes: TokenType[];
  public readonly numberTokenType: TokenType;
  public readonly idTokenType: TokenType;
  public readonly normalTokenTypePicker: TokenPicker;

  constructor(
    tokenPickerOptimizer: TokenPickerOptimizer,
    vocabulary: TokenType[],
  ) {
    this.vocabulary = vocabulary;
    this.tokenTypeDictionary = {};
    for (const token of this.vocabulary) {
      this.tokenTypeDictionary[token.name] = token;
      if (token.PATTERN instanceof RegExp) {
        token.PATTERN = new RegExp(
          token.PATTERN.source,
          token.PATTERN.flags + "y",
        );
      }
    }
    this.hiddenTokenTypes = this.vocabulary.filter(
      (v) => v.GROUP === ChevrotainLexer.SKIPPED,
    );

    const normalTokenTypes = [PreprocessorTokens.Percentage].concat(
      this.vocabulary,
    );
    this.numberTokenType = tokens.NUMBER;
    this.idTokenType = tokens.ID;
    this.normalTokenTypePicker =
      tokenPickerOptimizer.optimize(normalTokenTypes);
  }

  skipHiddenTokens(state: PreprocessorLexerState) {
    while (
      this.hiddenTokenTypes.some((h) => state.tryConsume(h) !== undefined)
    );
  }

  tokenizePliTokensUntilSemicolon(state: PreprocessorLexerState): IToken[] {
    let token: IToken | undefined = undefined;
    const list: IToken[] = [];
    do {
      token = this.getNextPliToken(state);
      if (token) {
        // TODO: Ignore hidden tokens already here?
        list.push(token);
      }
    } while (token && token.image !== ";");
    return list;
  }

  private getNextPliToken(state: PreprocessorLexerState): IToken | undefined {
    if (state.eof()) {
      return undefined;
    }
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
    const result: IToken[] = [];
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
