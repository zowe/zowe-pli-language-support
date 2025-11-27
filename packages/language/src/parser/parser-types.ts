import { IRecognitionException , IToken, TokenType} from "chevrotain";
import { ParserState } from "./parser-state";
import { expandTokenTypeIndices } from "./tokens";
import { memoize } from "lodash-es";

export interface Parser<TAst, TToken extends IToken = IToken> {
    set input(value: TToken[]);
    get errors(): IRecognitionException[];
    parse(): TAst;
}

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

export function choice(...sequences: (TokenTypeSequence|(() => RuleMap<any>))[]): TokenTypeChoice {
    return {
        type: "choice",
        sequences: sequences.filter((s): s is TokenTypeSequence => !(s instanceof Function)),
        ruleMaps: sequences.filter((s): s is () => RuleMap<any> => s instanceof Function),
    };
}

export type RuleMap<T=any> = Map<number, RuleMap<T>|Rule<T>>;

function compileToMap<T>(map: RuleMap<T>, firstSet: FirstSet, action: Rule<T>) {
    if (firstSet.type === "sequence") {
        for (const tokenTypeIdx of expandTokenTypeIndices(firstSet.tokenTypes[0])) {
            if(firstSet.tokenTypes.length > 1) {
                const map: RuleMap<T> = new Map();
                compileToMap(map, sequence(...firstSet.tokenTypes.slice(1)), action);
                map.set(tokenTypeIdx, map);
            } else {
                if(map.has(tokenTypeIdx)) {
                    throw new Error(`Ambiguous grammar detected. Multiple rules lead to the same token type: ${firstSet.tokenTypes[0].name}`);
                }
                map.set(tokenTypeIdx, action);
            }
        }
    } else {
        for (const sequence of firstSet.sequences) {
            compileToMap(map, sequence, action);
        }
        for (const ruleMap of firstSet.ruleMaps) {
            mergeMaps(map, ruleMap());
        }
    }
}

export type RuleFirstPair<T> = {
    first: () =>RuleMap<any>;
    rule: Rule<T>;
};

function mergeMaps<T>(target: RuleMap<T>, source: RuleMap<T>) {
    for (const [key, value] of source) {
        if (target.has(key)) {
            const existing = target.get(key);
            if (existing instanceof Function || value instanceof Function) {
                throw new Error(`Ambiguous grammar detected. Multiple rules lead to the same token type index: ${key}`);
            } else {
                mergeMaps(existing as RuleMap<T>, value as RuleMap<T>);
            }
        } else {
            target.set(key, value);
        }
    }
}

export function orRule<T>(...rules: (() => RuleFirstPair<T>)[]): RuleFirstPair<T> {
    class RuleFirstPairWrapper implements RuleFirstPair<T> {
        first: () => RuleMap<any>;
        rule: Rule<T>;
        constructor(...rules: (() => RuleFirstPair<T>)[]) {
            this.first = memoize(() => {
                const map: RuleMap<T> = new Map();
                for (const rule of rules) {
                    mergeMaps(map, rule().first());
                }
                return map;
            });
            this.rule = (state: ParserState) => {
                return state.consumeAlternatives<T>(this.first())!;
            };
        }
    }
    return new RuleFirstPairWrapper(...rules);
}

export function rule<T>(set: FirstSet|(() => RuleMap<any>), action: Rule<T>): RuleFirstPair<T> {
    if (typeof set === "function") {
        return {
            first: set,
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