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

export class TokenizerContext {
  public tokens: tokens.Token[] = [];
  public comments: tokens.Token[] = [];
  public char: string = "";
  public input: string;
  public length: number;
  public index: number = 0;
  public uri: URI | undefined;
  public diagnostics: Diagnostic[] = [];
  public caseUpper: boolean;
  public funcs: TokenizeFunc[] = [];

  private storedIndex: number = 0;
  /**
   * Whether a line break has been seen since the last token (or comment) was created.
   * Cheap to maintain (a single flag flip while scanning whitespace/comments, which the
   * tokenizer already does character-by-character) and replaces per-token line/column
   * tracking - see `Token.startsNewLine`. Public (like the other tokenizer-internal fields
   * on this class) so comment-scanning functions in this module can set it directly.
   */
  public sawNewlineSinceLastToken: boolean = false;

  constructor(input: string, uri: URI | undefined, caseUpper: boolean = true) {
    this.input = input;
    this.length = input.length;
    this.uri = uri;
    this.caseUpper = caseUpper;
    this.funcs = pliFuncs;
  }

  store() {
    this.storedIndex = this.index;
  }

  advance(n: number, newLines: boolean): void {
    if (newLines) {
      const end = this.index + n;
      for (let i = this.index; i < end; i++) {
        if (this.input[i] === "\n") {
          this.sawNewlineSinceLastToken = true;
        }
      }
    }
    this.index += n;
  }

  advanceWhitespace(): void {
    while (this.index < this.length) {
      const charCode = this.input.charCodeAt(this.index);
      if (isWhitespace(charCode)) {
        this.index++;
        if (charCode === lineFeed) {
          this.sawNewlineSinceLastToken = true;
        }
      } else {
        break;
      }
    }
  }

  createTokenInstance(tokenType: TokenType): tokens.Token {
    const image = this.input.substring(this.storedIndex, this.index);
    return this.createTokenInstanceWithImage(image, image, tokenType);
  }

  createTokenInstanceWithImage(
    image: string,
    originalImage: string,
    tokenType: TokenType,
  ): tokens.Token {
    const startsNewLine = this.sawNewlineSinceLastToken;
    this.sawNewlineSinceLastToken = false;
    return tokens.createTokenInstance(
      image,
      originalImage,
      tokenType,
      this.storedIndex,
      this.index - 1,
      this.uri,
      startsNewLine,
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

// 32-bit FNV-1a. Deliberately *not* the 64-bit variant: this hash runs once per identifier
// character of every file (the tokenizer's single hottest loop), and BigInt arithmetic
// heap-allocates on every operation - profiling showed it cost ~half the tokenizer's time,
// mostly as GC pressure. 32-bit hashes collide more readily in principle, but
// `generateKeywords` still throws on any collision within the keyword set, and a
// non-keyword identifier landing on a keyword's hash is caught by the `image` comparison
// in `tokenizeIdentifier`.
export const FNV_OFFSET_BASIS = 0x811c9dc5;
export const FNV_PRIME = 0x01000193;

export function fnvHash(str: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), FNV_PRIME);
  }
  return hash >>> 0;
}

export function generateKeywords(
  keywordMap: Map<string, TokenType>,
): Map<number, KeywordToken> {
  const keywords = new Map<number, KeywordToken>();
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
      let i = context.index + 2;
      let crossedNewline = false;
      // `startsNewLine` describes line breaks between *tokens* - a comment must not
      // consume the pending flag, or a real token after a line-leading comment would
      // wrongly report `startsNewLine === false` (which would break `performRecovery`'s
      // line-boundary detection on the comment-preserving `%INCLUDE` tokenize path).
      // The comment token itself still takes the pre-comment flag value (via
      // `createTokenInstance`, which resets it); restored below, with any newline
      // *inside* the comment carrying forward to the next token as well.
      const pendingNewline = context.sawNewlineSinceLastToken;
      while (i < context.length) {
        if (context.input[i] === "*" && context.input[i + 1] === "/") {
          i += 2;
          break;
        } else if (context.input[i] === "\n") {
          crossedNewline = true;
        }
        i++;
      }
      context.index = i;
      context.comments.push(context.createTokenInstance(tokens.ML_COMMENT));
      context.sawNewlineSinceLastToken = pendingNewline || crossedNewline;
      return undefined;
    } else if (nextChar === "/") {
      // Line comment
      let i = context.index + 2;
      let crossedNewline = false;
      // See the block-comment branch above: preserve the pending flag for the next token.
      const pendingNewline = context.sawNewlineSinceLastToken;
      while (i < context.length) {
        i++;
        if (context.input[i] === "\n") {
          // Skip the newline character as well
          i++;
          crossedNewline = true;
          break;
        }
      }
      context.index = i;
      context.comments.push(context.createTokenInstance(tokens.SL_COMMENT));
      context.sawNewlineSinceLastToken = pendingNewline || crossedNewline;
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
  return context.createTokenInstance(tokens.Semicolon);
}

const numberRegex = tokens.NUMBER.PATTERN as RegExp;
export const tokenizeNumber = tokenizeRegex(tokens.NUMBER, numberRegex);
export function tokenizeIdentifier(
  keywords: Map<number, KeywordToken>,
): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    let start = context.index;
    let hash = FNV_OFFSET_BASIS;
    let i = context.index;
    let charCode: number;
    let hasLowerCase = false;
    while (i < context.length) {
      charCode = context.input.charCodeAt(i);
      if (!isIdChar(charCode)) {
        break;
      }
      if (charCode >= 97 && charCode <= 122) {
        hasLowerCase = true;
        if (context.caseUpper) {
          // Lowercase character, must be uppercased
          charCode &= ~0x20;
        }
      }
      hash = Math.imul(hash ^ charCode, FNV_PRIME);
      i++;
    }
    const originalImage = context.input.substring(start, i);
    // `toUpperCase` allocates a second string per identifier; skip it when the scan above
    // saw no lowercase character (the common case in real PL/I source).
    const image =
      context.caseUpper && hasLowerCase
        ? originalImage.toUpperCase()
        : originalImage;
    const previousToken = context.tokens[context.tokens.length - 1];
    // Specific handling for EXEC (likely EXEC SQL or EXEC CICS)
    if (previousToken?.tokenTypeIdx === tokens.EXEC.tokenTypeIdx) {
      // Scan to the terminating `;`, skipping quoted strings - see
      // `findExecFragmentEnd` for how this stays in sync with the authoritative
      // `scanExecFragments` extent in preprocessor-api (and for the accepted
      // residual mismatch on embedded-language comments).
      i = tokens.findExecFragmentEnd(context.input, i);
      // Advance without newline tracking: the fragment's own `startsNewLine` must
      // come from the pending pre-fragment flag (consumed by `createTokenInstance`
      // below), and line breaks *inside* the fragment image must not leak to the
      // token that follows it.
      context.advance(i - start, false);
      return context.createTokenInstance(tokens.ExecFragment);
    }
    let tokenType = tokens.ID;
    // `>>> 0` matches `fnvHash`'s unsigned normalization (Math.imul returns signed 32-bit).
    const keyword = keywords.get(hash >>> 0);
    if (keyword && keyword.image === image) {
      tokenType = keyword.kind;
    }
    context.advance(i - start, false);
    return context.createTokenInstanceWithImage(
      image,
      originalImage,
      tokenType,
    );
  };
}
