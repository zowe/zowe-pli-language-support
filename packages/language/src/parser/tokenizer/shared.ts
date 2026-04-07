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

import { TokenType } from "chevrotain";
import * as tokens from "../tokens";
import { URI } from "../../utils/uri";
import { Diagnostic, diagnosticFromCode } from "../../language-server/types";
import { pliFuncs } from "./pli-tokenizer";
import { PLICodes } from "../../validation/pli-codes";
import { cicsFuncs } from "./cics-tokenizer";
import { sqlFuncs } from "./sql-tokenizer";

export enum TokenizerMode {
  Default,
  CICS,
  SQL,
}

export class TokenizerContext {
  public tokens: tokens.Token[] = [];
  public comments: tokens.Token[] = [];
  public char: string = "";
  public input: string;
  public length: number;
  public index: number = 0;
  public line: number = 0;
  public column: number = 0;
  public uri: URI | undefined;
  public diagnostics: Diagnostic[] = [];
  public caseUpper: boolean;
  public mode: TokenizerMode = TokenizerMode.Default;
  public funcs: TokenizeFunc[] = [];

  private storedIndex: number = 0;
  private storedLine: number = 0;
  private storedColumn: number = 0;

  constructor(input: string, uri: URI | undefined, caseUpper: boolean = true) {
    this.input = input;
    this.length = input.length;
    this.uri = uri;
    this.caseUpper = caseUpper;
    this.funcs = pliFuncs;
  }

  switchMode(mode: TokenizerMode) {
    this.mode = mode;
    switch (mode) {
      case TokenizerMode.Default:
        this.funcs = pliFuncs;
        break;
      case TokenizerMode.CICS:
        this.funcs = cicsFuncs;
        break;
      case TokenizerMode.SQL:
        this.funcs = sqlFuncs; // switch to sqlFuncs when implemented
        break;
    }
  }

  store() {
    this.storedIndex = this.index;
    this.storedLine = this.line;
    this.storedColumn = this.column;
  }

  advance(n: number, newLines: boolean): void {
    if (newLines) {
      const end = this.index + n;
      for (let i = this.index; i < end; i++) {
        if (this.input[i] === "\n") {
          this.line++;
          this.column = 0;
        } else {
          this.column++;
        }
      }
    } else {
      this.column += n;
    }
    this.index += n;
  }

  advanceWhitespace(): void {
    while (this.index < this.length) {
      const charCode = this.input.charCodeAt(this.index);
      if (isWhitespace(charCode)) {
        this.index++;
        if (charCode === lineFeed) {
          this.line++;
          this.column = 0;
        } else {
          this.column++;
        }
      } else {
        break;
      }
    }
  }

  createTokenInstance(tokenType: TokenType): tokens.Token {
    const image = this.input.substring(this.storedIndex, this.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokenType,
      this.storedIndex,
      this.storedLine,
      this.storedColumn,
      this.index - 1,
      this.line,
      this.column - 1,
      this.uri,
    );
  }

  createTokenInstanceWithImage(
    image: string,
    originalImage: string,
    tokenType: TokenType,
  ): tokens.Token {
    return tokens.createTokenInstance(
      image,
      originalImage,
      tokenType,
      this.storedIndex,
      this.storedLine,
      this.storedColumn,
      this.index - 1,
      this.line,
      this.column - 1,
      this.uri,
    );
  }
}

export type TokenizeFunc = (
  context: TokenizerContext,
) => tokens.Token | undefined;

export interface TwoCharToken {
  char: string;
  tokenType: TokenType;
}

export function generateDoubleCharFunc(
  tokenType: TokenType | undefined,
  others: TwoCharToken[],
): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    if (context.index + 1 < context.length) {
      const nextChar = context.input[context.index + 1];

      for (const follow of others) {
        if (nextChar === follow.char) {
          context.advance(2, false);
          return context.createTokenInstance(follow.tokenType);
        }
      }
    }
    if (tokenType === undefined) {
      return undefined;
    }
    context.advance(1, false);
    return context.createTokenInstance(tokenType);
  };
}

export function generateSingleCharFunc(tokenType: TokenType): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    context.advance(1, false);
    return context.createTokenInstance(tokenType);
  };
}

export function tokenizeRegex(
  tokenType: TokenType,
  regex: RegExp,
): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    regex.lastIndex = start;
    const match = regex.exec(context.input);
    if (match) {
      context.advance(match[0].length, false);
      return context.createTokenInstance(tokenType);
    } else {
      return undefined;
    }
  };
}

export function tokenizeWhitespace(
  context: TokenizerContext,
): tokens.Token | undefined {
  context.advanceWhitespace();
  return undefined;
}

const space = " ".charCodeAt(0);
const tab = "\t".charCodeAt(0);
const lineFeed = "\n".charCodeAt(0);
const carriageReturn = "\r".charCodeAt(0);
const formFeed = "\f".charCodeAt(0);
const verticalTab = "\v".charCodeAt(0);

function isWhitespace(char: number): boolean {
  return (
    char === space ||
    char === tab ||
    char === lineFeed ||
    char === carriageReturn ||
    char === formFeed ||
    char === verticalTab
  );
}

// Utility functions
export function isIdChar(char: number): boolean {
  return (
    // A-Z
    (char >= 65 && char <= 90) ||
    // a-z
    (char >= 97 && char <= 122) ||
    // 0-9
    (char >= 48 && char <= 57) ||
    // _
    char === 95 ||
    // @
    char === 64 ||
    // $
    char === 36 ||
    // #
    char === 35
  );
}

export interface KeywordToken {
  image: string;
  kind: TokenType;
}

export const FNV_OFFSET_BASIS = 0x00000100000001b3n;
export const FNV_PRIME = 0xcbf29ce484222325n;

export function fnvHash(str: string): bigint {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash ^= BigInt(str.charCodeAt(i));
    hash *= FNV_PRIME;
  }
  return hash;
}

export function generateKeywords(
  keywordMap: Map<string, TokenType>,
): Map<bigint, KeywordToken> {
  const keywords = new Map<bigint, KeywordToken>();
  for (const [image, kind] of keywordMap) {
    const hash = fnvHash(image);
    if (keywords.has(hash)) {
      const existing = keywords.get(hash)!;
      throw new Error(`FNV hash collision: ${image}, ${existing.image}`);
    }
    keywords.set(hash, { image, kind });
  }
  return keywords;
}
export function tokenizeSlashWithComment(
  context: TokenizerContext,
): tokens.Token | undefined {
  if (context.index + 1 < context.length) {
    const nextChar = context.input[context.index + 1];

    if (nextChar === "*") {
      // Block comment
      let line = context.line;
      let column = context.column + 2;
      let i = context.index + 2;
      while (i < context.length) {
        if (context.input[i] === "*" && context.input[i + 1] === "/") {
          i += 2;
          column += 2;
          break;
        } else if (context.input[i] === "\n") {
          line++;
          column = 0;
        } else {
          column++;
        }
        i++;
      }
      context.index = i;
      context.line = line;
      context.column = column;
      context.comments.push(context.createTokenInstance(tokens.ML_COMMENT));
      return undefined;
    } else if (nextChar === "/") {
      // Line comment
      let i = context.index + 2;
      while (i < context.length) {
        i++;
        if (context.input[i] === "\n") {
          // Skip the newline character as well
          i++;
          context.column = 0;
          context.line++;
          break;
        }
      }
      context.index = i;
      context.comments.push(context.createTokenInstance(tokens.SL_COMMENT));
      return undefined;
    } else if (nextChar === "=") {
      context.advance(2, false);
      return context.createTokenInstance(tokens.SlashEquals);
    }
  }

  context.advance(1, false);
  return context.createTokenInstance(tokens.Slash);
}
const stringRegex = tokens.STRING_TERM.PATTERN as RegExp;
const tokenizeStringInternal = tokenizeRegex(tokens.STRING_TERM, stringRegex);
export function tokenizeString(
  context: TokenizerContext,
): tokens.Token | undefined {
  const result = tokenizeStringInternal(context);
  if (result) {
    return result;
  }
  // Unterminated string, consume until the end of the line
  const start = context.index;
  let i = context.index;
  while (i < context.length) {
    const char = context.input[i];
    if (char === "\n") {
      break;
    }
    i++;
  }
  context.advance(i - start, false);
  // Generate the token for the error diagnostic
  const token = context.createTokenInstance(tokens.STRING_TERM);
  context.diagnostics.push(diagnosticFromCode(PLICodes.Severe.IBM3961I, token));
  // But return undefined to indicate no valid token was created
  return undefined;
}
export function tokenizeSemicolon(
  context: TokenizerContext,
): tokens.Token | undefined {
  context.advance(1, false);
  if (context.mode !== TokenizerMode.Default) {
    // Reset to default mode on semicolon, as it acts as a delimiter for all EXEC statements
    context.switchMode(TokenizerMode.Default);
  }
  return context.createTokenInstance(tokens.Semicolon);
}
const numberRegex = tokens.NUMBER.PATTERN as RegExp;
export const tokenizeNumber = tokenizeRegex(tokens.NUMBER, numberRegex);
export function tokenizeIdentifier(keywords: Map<bigint, KeywordToken>): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    let hash = FNV_OFFSET_BASIS;
    let i = context.index;
    let charCode: number;
    while (i < context.length) {
      charCode = context.input.charCodeAt(i);
      if (!isIdChar(charCode)) {
        break;
      }
      if (context.caseUpper && charCode >= 97 && charCode <= 122) {
        // Lowercase character, must be uppercased
        charCode &= ~0x20;
      }
      hash ^= BigInt(charCode);
      hash *= FNV_PRIME;
      i++;
    }
    const originalImage = context.input.substring(start, i);
    const image = context.caseUpper ? originalImage.toUpperCase() : originalImage;
    const previousToken = context.tokens[context.tokens.length - 1];
    // Specific handling for EXEC (likely EXEC SQL or EXEC CICS)
    if (previousToken?.tokenTypeIdx === tokens.EXEC.tokenTypeIdx) {
      if (image === "SQL") {
        context.advance(3, false);
        context.switchMode(TokenizerMode.SQL);
        return context.createTokenInstance(tokens.SQL);
      } else if (image === "CICS") {
        context.advance(4, false);
        context.switchMode(TokenizerMode.CICS);
        return context.createTokenInstance(tokens.CICS);
      }
    }
    let tokenType = tokens.ID;
    const keyword = keywords.get(hash);
    if (keyword && keyword.image === image) {
      tokenType = keyword.kind;
    }
    context.advance(i - start, false);
    return context.createTokenInstanceWithImage(image, originalImage, tokenType);
  }
}
