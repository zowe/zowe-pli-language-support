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
