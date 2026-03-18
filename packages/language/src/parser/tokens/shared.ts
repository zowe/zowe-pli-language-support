import { TokenType, Lexer, ITokenConfig } from "chevrotain";
import { URI } from "vscode-uri";
import * as ast from "../../syntax-tree/ast";
import { CstNodeKind } from "../../syntax-tree/cst";
import { createToken } from "../token-type-factory";
import { ID } from "./pli-tokens";

export interface Token {
  /**
   * The unique ID of the token.
   * This is assigned when the token is created.
   *
   * The ID is required to uniquely identify objects that are built from tokens.
   * This is mainly useful in the context of linking to identify duplicate qualified syntax nodes.
   *
   * Note that the ID may be `undefined` in some edge cases,
   * such as when tokens are created during the parser recovery.
   */
  id: number | undefined;
  image: string;
  originalImage: string;
  startOffset: number;
  startLine: number;
  startColumn: number;
  endOffset: number;
  endLine: number;
  endColumn: number;
  tokenTypeIdx: number;
  isInsertedInRecovery?: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
}
class TokenImpl implements Token {
  image: string;
  originalImage: string;
  id: number = 0;
  startOffset: number;
  startLine: number;
  startColumn: number;
  endOffset: number;
  endLine: number;
  endColumn: number;
  tokenTypeIdx: number;
  isInsertedInRecovery: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
  constructor(
    image: string,
    originalImage: string,
    id: number,
    tokenType: TokenType,
    startOffset: number,
    startLine: number,
    startColumn: number,
    endOffset: number,
    endLine: number,
    endColumn: number,
    uri: URI | undefined
  ) {
    this.image = image;
    this.originalImage = originalImage;
    this.id = id;
    this.startOffset = startOffset;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endOffset = endOffset;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.tokenTypeIdx = tokenType.tokenTypeIdx!;
    this.tokenType = tokenType;
    this.uri = uri;
    this.kind = undefined;
    this.element = undefined;
    this.isInsertedInRecovery = false;
    this.immediateFollow = false;
  }
}
/**
 * A simple incrementing ID generator for tokens.
 * Theoretically, this could overflow. However, the maximum safe integer in JavaScript is 2^53 - 1.
 * This would require a the language server to chew through that many tokens in a single session, which would likely take years.
 */
let nextTokenId = 1;

export function createTokenInstance(
  image: string,
  originalImage: string,
  tokenType: TokenType,
  startOffset: number,
  startLine: number,
  startColumn: number,
  endOffset: number,
  endLine: number,
  endColumn: number,
  uri: URI | undefined
): Token {
  return new TokenImpl(
    image,
    originalImage,
    nextTokenId++,
    tokenType,
    startOffset,
    startLine,
    startColumn,
    endOffset,
    endLine,
    endColumn,
    uri
  );
}

export const keywordMap = new Map<string, TokenType>();
export const keywords = new Set<TokenType>();
export const controlTokens = new Set<TokenType>();
export const modifierTokens = new Set<TokenType>();
//combination name -> {mapTo: keyword index -> enum value, mapFrom: enum value -> keyword name}
const mappings = new Map<
  string,
  {
    mapTo: Map<number, number>;
    mapFrom: Map<number, string>;
  }
>();

export enum KeywordType {
  Control,
  Modifier
}

export interface KeywordConfig {
  /**
   * The keyword name or names (aliases). The first name is the canonical name.
   */
  name: string | string[];
  /**
   * The type of the keyword, used for semantic highlighting. Optional, will use `KeywordType.Modifier` if not specified.
   */
  type?: KeywordType;
  categories?: [MappableTokenType, number][];
}

export function registerKeyword(config: KeywordConfig): TokenType {
  const names = Array.isArray(config.name) ? config.name : [config.name];
  const name = names[0];
  if (!name) {
    throw new Error("Keyword must have at least one, non-empty name");
  }
  const tokenType = createToken({
    name,
    pattern: Lexer.NA,
    categories: [
      ID,
      ...(config.categories ?? []).map((category) => category[0]),
    ],
  });
  for (const alias of names) {
    keywordMap.set(alias, tokenType);
  }
  assignToMappings(tokenType, config.categories ?? [], names);
  keywords.add(tokenType);
  switch (config.type) {
    case KeywordType.Control:
      controlTokens.add(tokenType);
      break;
    default:
      modifierTokens.add(tokenType);
      break;
  }
  return tokenType;
}

export interface OperatorConfig {
  name: string;
  categories?: [MappableTokenType, number][];
}
function assignToMappings(
  tokenType: TokenType,
  categories: [MappableTokenType, number][],
  names: string[]
) {
  for (const [category, enumValue] of categories) {
    const mapping = mappings.get(category.name)!;
    mapping.mapTo.set(tokenType.tokenTypeIdx!, enumValue);
    mapping.mapFrom.set(enumValue, names[0]);
  }
}

export function registerOperator(config: OperatorConfig): TokenType {
  const tokenType = createToken({
    name: config.name,
    pattern: Lexer.NA,
    categories: [...(config.categories ?? []).map((category) => category[0])],
  });
  assignToMappings(tokenType, config.categories ?? [], [config.name]);
  return tokenType;
}
export const combinations: TokenType[] = [];

export type MappableTokenType<TEnum extends number = number> = TokenType & {
  mapToEnumLiteral(tokenIndex: number): TEnum;
  mapFromEnumLiteral(value: TEnum): string;
};
function createMappableToken<TEnum extends number = number>(
  config: ITokenConfig
): MappableTokenType<TEnum> {
  const tokenType = createToken(config);
  mappings.set(tokenType.name, {
    mapTo: new Map<number, number>(),
    mapFrom: new Map<number, string>(),
  });
  return {
    ...tokenType,
    mapToEnumLiteral(tokenIndex: number): TEnum {
      const mapping = mappings.get(tokenType.name)!;
      return mapping.mapTo.get(tokenIndex) as TEnum;
    },
    mapFromEnumLiteral(value: TEnum): string {
      const mapsTo = mappings.get(tokenType.name)!;
      return mapsTo.mapFrom.get(value)!;
    },
  };
}

export function registerCombination<TEnum extends number = number>(name: string) {
  const tokenType = createMappableToken<TEnum>({
    name,
    pattern: Lexer.NA,
  });
  combinations.push(tokenType);
  return tokenType;
}
