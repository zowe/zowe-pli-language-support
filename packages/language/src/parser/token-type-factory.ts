import {
  createToken as originalCreateToken,
  ITokenConfig,
  TokenType,
} from "chevrotain";

const tokenTypesByIdx: Map<number, TokenType> = new Map();

export function createToken(config: ITokenConfig): TokenType {
  const tokenType = originalCreateToken(config);
  tokenTypesByIdx.set(tokenType.tokenTypeIdx!, tokenType);
  return tokenType;
}

export function tokenIdxToClass(tokenTypeIdx: number): TokenType | undefined {
  return tokenTypesByIdx.get(tokenTypeIdx);
}
