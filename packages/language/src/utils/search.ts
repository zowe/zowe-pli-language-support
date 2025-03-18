import { IToken } from "chevrotain";

export function binaryTokenSearch(tokens: IToken[], offset: number): IToken | undefined {
    let low = 0;
    let high = tokens.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const token = tokens[mid];
        if (token.startOffset <= offset && offset <= token.endOffset!) {
            return token;
        } else if (token.startOffset > offset) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return undefined;
}