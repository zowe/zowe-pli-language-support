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
import { TokenType, Lexer, ITokenConfig } from "chevrotain";
import { URI } from "vscode-uri";
import * as ast from "../../syntax-tree/ast";
import { CstNodeKind } from "../../syntax-tree/cst";
import { createToken } from "../token-type-factory";
import type { SemanticTokenTypes } from "../../language-server/semantic-tokens";

export const ID = createToken({
  name: "ID",
  pattern: /[$@#_a-z][\w_$@#]*/iy,
});

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
  endOffset: number;
  tokenTypeIdx: number;
  isInsertedInRecovery?: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
  /**
   * Whether at least one line break occurs between the end of the previous token and the
   * start of this one. Parser error recovery needs to know whether it has crossed onto a new line.
   */
  startsNewLine: boolean;
  /**
   * Whether this token was lexed from preprocessor-generated text rather than text present
   * in any source file.
   */
  synthetic?: boolean;
  /**
   * Semantic token type assigned by a preprocessor phase for tokens inside
   * preprocessor-owned text (e.g. the body of an `EXEC SQL`/`EXEC CICS` statement, whose
   * classification comes from the external preprocessor engine rather than the PL/I
   * grammar). Rendered with the `preprocessor` modifier by semantic highlighting.
   */
  semanticType?: SemanticTokenTypes;
}
class TokenImpl implements Token {
  image: string;
  originalImage: string;
  id: number = 0;
  startOffset: number;
  endOffset: number;
  tokenTypeIdx: number;
  isInsertedInRecovery: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
  startsNewLine: boolean;
  constructor(
    image: string,
    originalImage: string,
    id: number,
    tokenType: TokenType,
    startOffset: number,
    endOffset: number,
    uri: URI | undefined,
    startsNewLine: boolean = false,
  ) {
    this.image = image;
    this.originalImage = originalImage;
    this.id = id;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
    this.tokenTypeIdx = tokenType.tokenTypeIdx!;
    this.tokenType = tokenType;
    this.uri = uri;
    this.kind = undefined;
    this.element = undefined;
    this.isInsertedInRecovery = false;
    this.immediateFollow = false;
    this.startsNewLine = startsNewLine;
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
  endOffset: number,
  uri: URI | undefined,
  startsNewLine: boolean = false,
): Token {
  return new TokenImpl(
    image,
    originalImage,
    nextTokenId++,
    tokenType,
    startOffset,
    endOffset,
    uri,
    startsNewLine,
  );
}

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
  Modifier,
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

export function createKeywordRegistry() {
  const keywordMap = new Map<string, TokenType>();
  const keywords = new Set<TokenType>();
  return {
    keywordMap,
    keywords,
    registerKeyword: (config: KeywordConfig) => registerKeyword(config),
  };
  function registerKeyword(config: KeywordConfig): TokenType {
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
}

export interface OperatorConfig {
  name: string;
  categories?: [MappableTokenType, number][];
}
function assignToMappings(
  tokenType: TokenType,
  categories: [MappableTokenType, number][],
  names: string[],
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
  config: ITokenConfig,
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

export function registerCombination<TEnum extends number = number>(
  name: string,
) {
  const tokenType = createMappableToken<TEnum>({
    name,
    pattern: Lexer.NA,
  });
  combinations.push(tokenType);
  return tokenType;
}
