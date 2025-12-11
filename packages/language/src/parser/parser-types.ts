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

export type Rule<T> = (state: ParserState) => T;

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

export type RuleFirstPair<T> = {
  first: () => RuleMap<any>;
  rule: Rule<T | null>;
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

export function orRule<T>(
  ...rules: (() => RuleFirstPair<T>)[]
): RuleFirstPair<T> {
  class RuleFirstPairWrapper implements RuleFirstPair<T> {
    first: () => RuleMap<any>;
    rule: Rule<T | null>;
    constructor(...rules: (() => RuleFirstPair<T>)[]) {
      this.first = memoize(() => {
        const map: RuleMap<T> = new Map();
        for (const rule of rules) {
          mergeMaps(map, rule().first());
        }
        return map;
      });
      this.rule = (state: ParserState) => {
        return state.consumeAlternatives<T>(this.first());
      };
    }
  }
  return new RuleFirstPairWrapper(...rules);
}

export function rule<T>(
  set: FirstSet | (() => RuleMap<any>),
  originalAction: Rule<T>,
): RuleFirstPair<T> {
  const action = (state: ParserState) => {
    if (state.eof) {
      return null;
    }
    return originalAction(state);
  };
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
