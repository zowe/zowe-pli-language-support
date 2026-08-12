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

import { Token } from "../parser/tokens";

export function binaryTokenSearch(
  tokens: Token[],
  offset: number,
): Token | undefined {
  return tokens[binaryTokenIndexSearch(tokens, offset)];
}

export function binaryTokenIndexSearch(
  tokens: Token[],
  offset: number,
): number {
  let low = 0;
  let high = tokens.length - 1;
  let token: Token | undefined;
  let mid = -1;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    token = tokens[mid];
    const start = token.startOffset;
    const end = token.endOffset;
    if (start === offset) {
      const previousToken = tokens[mid - 1];
      if (previousToken && isAtTokenEnd(previousToken, offset)) {
        // If the offset is right after the end of a word token, return that token
        return mid - 1;
      } else {
        return mid;
      }
    } else if (start < offset && offset <= end) {
      return mid;
    } else if (isAtTokenEnd(token, offset)) {
      // If the offset is right after the end of a word token, return that token
      return mid;
    } else if (start > offset) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
}

function isAtTokenEnd(token: Token, offset: number): boolean {
  const end = token.endOffset;
  // If the offset is right after the end of a word token, return that token
  return offset - end === 1 && /\w$/u.test(token.image);
}

function isBeforeTokenEnd(token: Token, offset: number): boolean {
  return token.endOffset >= offset || isAtTokenEnd(token, offset);
}

export function completionTokenIndexSearch(
  tokens: Token[],
  offset: number,
): number {
  if (tokens.length === 0) {
    return -1;
  }
  const end = tokens.length - 1;
  // Start at -1 to return undefined if the offset is before the end of the first token
  for (let i = -1; i < end; i++) {
    const nextToken = tokens[i + 1];
    if (isBeforeTokenEnd(nextToken, offset)) {
      return i;
    }
  }
  return end;
}

/**
 * Find the rightmost token whose start offset is less than or equal to the given offset.
 * @param tokens The array of tokens to search.
 * @param offset The offset to compare against token start offsets.
 * @returns The index of the rightmost token whose start offset is less than or equal to the given offset, or -1 if no such token exists.
 * @example Imagine you want to find a token index in a list of tokens that represents a line of code,
 * and you want to find the token that is closest to a certain position in the line.
 * You can use this function to efficiently find the rightmost token that starts before or at that position.
 *
 * ```
 * MAX(2, <|x> 3)
 * ```
 *
 * Index x represents the offset you want to find the token for.
 * The function will return the index of the token that starts at or before that offset,
 * which in this case would be the token representing the comma after the number 2, since it is the rightmost
 * token that starts before or at the offset of index x.
 * This is needed because we act one a filtered list of tokens (Whitespace tokens are filtered out)
 * and we want to find the token that is closest to a certain position in the line.
 */
export function binaryTokenIndexRightMost(
  tokens: Token[],
  offset: number,
): number {
  return rightmostIndexLE(tokens, offset, tokenStartOffset);
}

const tokenStartOffset = (token: { startOffset: number }) => token.startOffset;

/**
 * Rightmost index whose `start(item)` is `<= value`, in an array sorted ascending by that
 * key - or `-1` if every key is greater. The shared binary-search primitive behind every
 * offset-based token/segment lookup ({@link binaryTokenIndexRightMost},
 * `SourceMap.segmentAt`, `token-annotator`'s mapped-token lookup, ...). The dual "first
 * index at or after `value`" is `rightmostIndexLE(items, value - 1, start) + 1`.
 */
export function rightmostIndexLE<T>(
  items: readonly T[],
  value: number,
  start: (item: T) => number,
): number {
  let low = 0;
  let high = items.length - 1;
  let result = -1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (start(items[mid]) > value) {
      high = mid - 1;
    } else {
      result = mid;
      low = mid + 1;
    }
  }
  return result;
}
