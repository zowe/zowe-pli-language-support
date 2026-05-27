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
import { ParserState } from "./parser-state";
import { memoize } from "lodash-es";
import { assertType } from "../preprocessor/util";
import { diagnosticFromCode } from "../language-server/types";
import { LspCodes } from "../validation/lsp-codes";
import { ReferenceType } from "../syntax-tree/ast";

export interface ExpressionParameter {
  refType?: ReferenceType;
  multiple?: boolean; // Whether multiple expressions are allowed, separated by commas
  init?: boolean; // Whether we are in an INITIAL attribute expression
}

export type Rule<T, Args extends any[] = any[]> = (
  state: ParserState,
  ...args: Args
) => T;

export type TokenTypeSequence = {
  type: "sequence";
  tokenTypes: TokenType[];
};

export type TokenTypeChoice = {
  type: "choice";
  sequences: TokenTypeSequence[];
  ruleMaps: (() => RuleMap<any>)[];
};

export type FirstSet = TokenTypeChoice | TokenTypeSequence;

export function sequence(...tokenTypes: TokenType[]): TokenTypeSequence {
  return {
    type: "sequence",
    tokenTypes,
  };
}

export function choice(
  ...sequences: (TokenTypeSequence | (() => RuleMap<any>))[]
): TokenTypeChoice {
  return {
    type: "choice",
    sequences: sequences.filter(
      (s): s is TokenTypeSequence => !(s instanceof Function),
    ),
    ruleMaps: sequences.filter(
      (s): s is () => RuleMap<any> => s instanceof Function,
    ),
  };
}

export type RuleMap<T = any> = Map<number, RuleMap<T> | Rule<T>>;

function compileToMap<T>(map: RuleMap<T>, firstSet: FirstSet, action: Rule<T>) {
  if (firstSet.type === "sequence") {
    const tokenType = firstSet.tokenTypes[0];
    const tokenTypeIdx = tokenType.tokenTypeIdx!;
    if (firstSet.tokenTypes.length > 1) {
      const innerMap: RuleMap<T> = new Map();
      compileToMap(innerMap, sequence(...firstSet.tokenTypes.slice(1)), action);
      map.set(tokenTypeIdx, innerMap);
    } else {
      if (map.has(tokenTypeIdx)) {
        throw new Error(
          `Ambiguous grammar detected. Multiple rules lead to the same token type: ${tokenType.name}`,
        );
      }
      map.set(tokenTypeIdx, action);
      if (tokenType.isParent === true && tokenType.categoryMatchesMap) {
        for (const [index, ok] of Object.entries(
          tokenType.categoryMatchesMap,
        )) {
          if (ok) {
            const idx = Number(index);
            map.set(idx, action);
          }
        }
      }
    }
  } else {
    for (const sequence of firstSet.sequences) {
      compileToMap(map, sequence, action);
    }
    for (const ruleMap of firstSet.ruleMaps) {
      mergeMaps(map, ruleMap(), action);
    }
  }
}

export type RuleFirstPair<T, Args extends any[] = any[]> = {
  first: () => RuleMap<any>;
  rule: Rule<T | null, Args>;
};

function mergeMaps<T>(
  target: RuleMap<T>,
  source: RuleMap<T>,
  action?: Rule<T>,
) {
  for (const [key, value] of source) {
    if (target.has(key)) {
      const existing = target.get(key);
      if (existing instanceof Function || value instanceof Function) {
        throw new Error(
          `Ambiguous grammar detected. Multiple rules lead to the same token type index: ${key}`,
        );
      } else {
        mergeMaps(existing as RuleMap<T>, value as RuleMap<T>, action);
      }
    } else {
      target.set(key, action ?? value);
    }
  }
}

export function orRule<T, Args extends any[]>(
  ...rules: (() => RuleFirstPair<T, Args>)[]
): RuleFirstPair<T, Args> {
  class RuleFirstPairWrapper implements RuleFirstPair<T, Args> {
    first: () => RuleMap<any>;
    rule: Rule<T | null, Args>;
    constructor(...rules: (() => RuleFirstPair<T, Args>)[]) {
      this.first = memoize(() => {
        const map: RuleMap<T> = new Map();
        for (const rule of rules) {
          mergeMaps(map, rule().first());
        }
        return map;
      });
      this.rule = (state: ParserState, ...args: Args) => {
        return state.consumeAlternatives<T, Args>(this.first(), args);
      };
    }
  }
  return new RuleFirstPairWrapper(...rules);
}

export function anyOrderRule<
  K extends string,
  T extends Record<K, any>,
  Args extends any[],
>(anyOf: { [P in K]: () => RuleFirstPair<T[P], Args> }): RuleFirstPair<
  Partial<T>,
  Args
> {
  class RuleFirstPairWrapper implements RuleFirstPair<T, Args> {
    first: () => RuleMap<any>;
    rule: Rule<T | null, Args>;
    constructor(rules: { [P in K]: () => RuleFirstPair<T[P], Args> }) {
      this.first = memoize(() => {
        const map: RuleMap<T> = new Map();
        for (const rule of Object.values(rules)) {
          assertType<() => RuleFirstPair<T[keyof T], Args>>(rule);
          mergeMaps(map, rule().first());
        }
        return map;
      });
      this.rule = (state: ParserState, ...args: Args) => {
        let result: Partial<T> = {};
        while (state.canConsumeFirst(this.first())) {
          for (const [key, rule] of Object.entries(rules)) {
            assertType<K>(key);
            assertType<() => RuleFirstPair<T[keyof T], Args>>(rule);
            const first = rule().first();
            if (state.canConsumeFirst(first)) {
              const token = state.token;
              const ast = rule().rule(state, ...args) ?? undefined;
              if (result[key] && token) {
                state.diagnostics.push(
                  diagnosticFromCode(
                    LspCodes.Cics.DuplicatedSpecification,
                    token,
                    token.image,
                  ),
                );
                continue;
              }
              result[key] = ast;
            }
          }
        }
        return result as T;
      };
    }
  }
  return new RuleFirstPairWrapper(anyOf);
}

export function rule<T, Args extends any[]>(
  set: FirstSet | (() => RuleMap<any>),
  action: Rule<T, Args>,
): RuleFirstPair<T, Args> {
  if (typeof set === "function") {
    return {
      first: memoize(() => {
        const map = new Map<number, RuleMap<T>>();
        mergeMaps(map, set(), action);
        return map;
      }),
      rule: action,
    };
  } else {
    return {
      first: memoize(() => {
        const map: RuleMap<T> = new Map();
        compileToMap(map, set, action);
        return map;
      }),
      rule: action,
    };
  }
}

export function throwHasManualLookahead(): never {
  throw new Error(
    "This rule has manual lookahead and cannot be used in automatic parsing.",
  );
}
