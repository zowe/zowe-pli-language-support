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
import { Diagnostic } from "../../language-server/types";
import { pliFuncs } from "./pli-tokenizer";

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
        this.funcs = pliFuncs; // switch to cicsFuncs when implemented
        break;
      case TokenizerMode.SQL:
        this.funcs = pliFuncs; // switch to sqlFuncs when implemented
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
  tokenType: TokenType,
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
