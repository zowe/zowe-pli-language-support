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

import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { URI } from "../utils/uri";

export interface PreprocessorLexerState {
  currentChar(): number;
  eof(): boolean;
  position(): number;
  advanceScan(scanned: string): void;
  advanceLines(lineCount: number): void;
  tryConsume(tokenType: TokenType): IToken | undefined;
  canConsume(tokenType: TokenType): string | undefined;
  emit(image: string, tokenType: TokenType): IToken;
}

export type TokenMatcher = (text: string, index: number) => string | undefined;

const tokenMatcherCache: TokenMatcher[] = [];

function getTokenMatcher(token: TokenType): TokenMatcher {
  if (tokenMatcherCache[token.tokenTypeIdx!]) {
    return tokenMatcherCache[token.tokenTypeIdx!];
  }
  const pattern = token.PATTERN;
  let tokenMatcher: TokenMatcher;
  if (pattern instanceof RegExp) {
    tokenMatcher = (text: string, index: number) => {
      pattern.lastIndex = index;
      const match = pattern.exec(text);
      return match
        ? handleLongerAlternative(token, match[0], text, index)
        : undefined;
    };
  } else if (typeof pattern === "function") {
    const tokens: IToken[] = [];
    const groups = {};
    tokenMatcher = (text: string, index: number) => {
      const match = pattern(text, index, tokens, groups);
      return match
        ? handleLongerAlternative(token, match[0], text, index)
        : undefined;
    };
  } else if (typeof pattern === "string") {
    const len = pattern.length;
    tokenMatcher = (text: string, index: number) => {
      for (let i = 0; i < len; i++) {
        // Lowercase both characters for case-insensitive comparison
        if (
          (text.charCodeAt(i + index) | 0x20) !==
          (pattern.charCodeAt(i) | 0x20)
        ) {
          return undefined;
        }
      }
      return handleLongerAlternative(token, pattern, text, index);
    };
  } else {
    throw new Error(
      `Token type "${token.name}" does not have a valid pattern.`,
    );
  }
  tokenMatcherCache[token.tokenTypeIdx!] = tokenMatcher;
  return tokenMatcher;
}

function handleLongerAlternative(
  tokenType: TokenType,
  match: string,
  text: string,
  index: number,
) {
  if (tokenType.LONGER_ALT) {
    //if a "longer" alternative can be detected, deny
    const alternatives = Array.isArray(tokenType.LONGER_ALT)
      ? tokenType.LONGER_ALT
      : [tokenType.LONGER_ALT];
    if (alternatives.some((a) => hasLongerAlternative(a, match, text, index))) {
      return undefined;
    }
  }
  return match;
}

function hasLongerAlternative(
  tokenType: TokenType,
  match: string,
  text: string,
  index: number,
): boolean {
  const longerAltMatcher = getTokenMatcher(tokenType);
  const alternative = longerAltMatcher(text, index);
  return (
    alternative !== undefined &&
    alternative.length > match.length &&
    //TODO this last condition should be implicit. But actually there is a bug and this condition needs to be checked as well.
    alternative.startsWith(match)
  );
}

export class PliPreprocessorLexerState implements PreprocessorLexerState {
  private readonly plainState: PlainPreprocessorLexerState;

  constructor(text: string, uri: URI | undefined) {
    this.plainState = initializePreprocessorState(text, uri);
  }

  currentChar(): number {
    return this.eof()
      ? -1
      : this.plainState.text.charCodeAt(this.plainState.offset);
  }

  eof(): boolean {
    return Selectors.eof(this.plainState);
  }

  position(): number {
    return Selectors.position(this.plainState);
  }

  tryConsume(tokenType: TokenType): IToken | undefined {
    const image = this.canConsume(tokenType);
    if (!image) {
      return undefined;
    }
    return this.emit(image, tokenType);
  }

  emit(image: string, tokenType: TokenType) {
    const startOffset = Selectors.position(this.plainState);
    this.advanceScan(image);
    const endOffset = Selectors.position(this.plainState);
    // ATTENTION: mind the -1 for end offset, we do not want to consume the next tokens range!
    // Note that we don't need line/column information for our LSP implementation
    const token = createTokenInstance(
      tokenType,
      image,
      startOffset,
      endOffset - 1,
      NaN,
      NaN,
      NaN,
      NaN,
    );
    token.payload = {
      uri: this.plainState.uri,
      kind: -1,
      element: null,
    };
    return token;
  }

  canConsume(tokenType: TokenType): string | undefined {
    if (Selectors.eof(this.plainState)) {
      return undefined;
    }
    const { offset: index, text } = this.plainState;
    const tokenMatcher = getTokenMatcher(tokenType);
    return tokenMatcher(text, index);
  }

  handleLongerAlternative(tokenType: TokenType, match: string) {
    if (tokenType.LONGER_ALT) {
      //if a "longer" alternative can be detected, deny
      const alternatives = Array.isArray(tokenType.LONGER_ALT)
        ? tokenType.LONGER_ALT
        : [tokenType.LONGER_ALT];
      if (alternatives.some((a) => this.hasLongerAlternative(a, match))) {
        return undefined;
      }
    }
    return match;
  }

  hasLongerAlternative(tokenType: TokenType, match: string): boolean {
    const alternative = this.canConsume(tokenType);
    return (
      alternative !== undefined && alternative.length > match.length
      // TODO: Figure out why this was added (it doesn't seem to actually apply)
      // TODO this last condition should be implicit. But actually there is a bug and this condition needs to be checked as well.
      // && alternative.startsWith(match)
    );
  }

  advanceLines(lineCount: number) {
    if (Selectors.eof(this.plainState)) {
      return;
    }
    const { text, offset } = this.plainState;
    const newPosition = Mutators.advanceLines(offset, text, lineCount);
    Mutators.advanceCharacters(this.plainState, newPosition - offset);
  }

  advanceScan(scanned: string) {
    Mutators.advanceCharacters(this.plainState, scanned.length);
  }
}

// PLAIN STATE

export type PreprocessorScan = {
  length: number;
  offset: number;
  text: string;
  uri: URI | undefined;
};

export type PlainPreprocessorLexerState = PreprocessorScan;

export const initializePreprocessorState: (
  text: string,
  uri: URI | undefined,
) => PlainPreprocessorLexerState = (text, uri) => {
  return {
    tokens: [],
    text,
    length: text.length,
    offset: 0,
    uri,
  };
};

// SELECTORS

namespace Selectors {
  export function eof(state: PlainPreprocessorLexerState): boolean {
    return state.offset >= state.text.length;
  }
  export function position(state: PlainPreprocessorLexerState): number {
    return state.offset;
  }
}

// MUTATORS

namespace Mutators {
  export function advanceCharacters(
    state: PlainPreprocessorLexerState,
    length: number,
  ): void {
    state.offset += length;
  }

  const nl = "\n".charCodeAt(0);
  export function advanceLines(
    offset: number,
    text: string,
    lineCount: number,
  ): number {
    while (true) {
      const char = text.charCodeAt(offset);
      if (char === nl) {
        lineCount--;
        if (lineCount <= 0) {
          return offset + 1;
        }
      }
      if (isNaN(char)) {
        // Reached EOF
        return offset;
      }
      offset++;
    }
  }

  /** TODO: what is this supposed to do? */
  export function countNewLinesWhile(
    offset: number,
    text: string,
    whilePredicate: (currentPosition: number) => boolean,
  ): number {
    const NL = /\r?\n/y;
    for (; offset < text.length && whilePredicate(offset); ) {
      NL.lastIndex = offset;
      const match = NL.exec(text);
      if (match) {
        offset += match[0].length;
      } else {
        offset++;
      }
    }
    return offset;
  }
}
