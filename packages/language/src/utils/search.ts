import { IToken } from "chevrotain";

export function binaryTokenSearch(
  tokens: IToken[],
  offset: number,
): IToken | undefined {
  let low = 0;
  let high = tokens.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const token = tokens[mid];
    const start = token.startOffset;
    const end = token.endOffset!;
    if (start <= offset && offset <= end) {
      return token;
    } else if (offset - end === 1 && /\w$/u.test(token.image)) {
      // If the offset is right after the end of a word token, return that token
      return token;
    } else if (start > offset) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return undefined;
}
