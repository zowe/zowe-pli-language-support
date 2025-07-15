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

import {
  EmbeddedActionsParser,
  IOrAlt,
  IParserConfig,
  ParserMethod,
  SubruleMethodOpts,
  TokenType,
} from "chevrotain";
import { LLStarLookaheadStrategy } from "chevrotain-allstar";
import {
  SyntaxKind,
  type BinaryExpression,
  type SyntaxNode,
} from "../syntax-tree/ast";
import type { CstNodeKind } from "../syntax-tree/cst";
import * as tokens from "./tokens";
import { Token } from "./tokens";

/**
 * Options for assigning a result to a subrule.
 * @template ARGS - The arguments type for the subrule.
 * @template R - The return type of the subrule.
 */
export interface SubruleAssignMethodOpts<ARGS, R>
  extends SubruleMethodOpts<ARGS> {
  /**
   * A function to assign the result of the subrule.
   * @param result - The result to assign.
   */
  assign: (result: R) => void;
}

/**
 * Represents an intermediate binary expression used during parsing.
 */
export interface IntermediateBinaryExpression {
  /**
   * The items (operands) in the binary expression.
   */
  items: any[];

  /**
   * The operators in the binary expression.
   */
  operators: Token[];

  /**
   * Indicates that this is an infix expression.
   */
  infix: true;
}

export class AbstractParser extends EmbeddedActionsParser {
  constructor(tokens: TokenType[], config?: IParserConfig) {
    super(tokens, {
      ...config,
      recoveryEnabled: true,
      lookaheadStrategy: new LLStarLookaheadStrategy(),
    });
  }

  /**
   * Assigns a payload to a token
   * @param token - The token to assign the payload to
   * @param element - The syntax node associated with the token
   * @param kind - The kind of CST node
   */
  protected tokenPayload(
    token: Token,
    element: SyntaxNode,
    kind: CstNodeKind,
  ): void {
    if (isNaN(token.startOffset)) {
      return;
    }
    token.payload.kind = kind;
    token.payload.element = element;
  }

  private stack: any[] = [];

  protected push<T>(value: T): T {
    return this.ACTION(() => {
      this.stack.push(value);
      return value;
    });
  }

  protected peek(): any {
    return this.stack[this.stack.length - 1];
  }

  protected replace<T>(value: T): T {
    return this.ACTION(() => {
      this.stack[this.stack.length - 1] = value;
      return value;
    });
  }

  protected pop<T>(): T {
    return this.ACTION(() => {
      let element = this.stack.pop();
      if (element && "infix" in element) {
        element = constructBinaryExpression(element);
      }
      return element;
    });
  }

  /**
   * Defines an OR rule with a name and a set of alternative rules.
   */
  protected OR_RULE<T>(
    name: string,
    rules: () => ParserMethod<any, any>[],
  ): ParserMethod<any, T> {
    let alts: IOrAlt<any>[] | undefined;
    return this.RULE<() => T>(name, () => {
      this.push({});
      this.OR(
        alts ??
          (alts = rules().map((rule, idx) => ({
            ALT: () => {
              this.subrule_assign(idx, rule, {
                assign: (result) => this.replace(result),
              });
            },
          }))),
      );
      return this.pop();
    });
  }

  protected consume_assign(
    index: number,
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    const token = this.consume(index, tokenType) as Token;
    this.ACTION(() => assign(token));
  }

  protected CONSUME_ASSIGN(
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    this.consume_assign(0, tokenType, assign);
  }

  protected CONSUME_ASSIGN1(
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    this.consume_assign(1, tokenType, assign);
  }

  protected CONSUME_ASSIGN2(
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    this.consume_assign(2, tokenType, assign);
  }

  protected CONSUME_ASSIGN3(
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    this.consume_assign(3, tokenType, assign);
  }

  protected CONSUME_ASSIGN4(
    tokenType: TokenType,
    assign: (value: Token) => void,
  ): void {
    this.consume_assign(4, tokenType, assign);
  }

  protected subrule_assign<ARGS extends unknown[], R>(
    index: number,
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    let value: R;
    try {
      value = this.subrule(index, ruleToCall, options);
    } finally {
      this.ACTION(() => {
        if (value === undefined) {
          value = this.pop();
        }
        if (value !== undefined) {
          options.assign(value);
        }
      });
    }
  }

  protected SUBRULE_ASSIGN<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(0, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN1<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(1, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN2<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(2, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN3<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(3, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN4<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(4, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN5<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(5, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN6<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(6, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN7<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(7, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN8<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(8, ruleToCall, options);
  }

  protected SUBRULE_ASSIGN9<ARGS extends unknown[], R>(
    ruleToCall: ParserMethod<ARGS, R>,
    options: SubruleAssignMethodOpts<ARGS, R>,
  ): void {
    this.subrule_assign(9, ruleToCall, options);
  }
}

/**
 * Builds a precedence map from precedence groups
 */
function buildPrecendenceMap(
  precedenceGroups: TokenType[][],
): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = 0; i < precedenceGroups.length; i++) {
    const group = precedenceGroups[i];
    for (const token of group) {
      map.set(token.name, i);
    }
  }
  return map;
}

const binaryPrecedence = buildPrecendenceMap([
  // Priority 1, **
  [tokens.StarStar],
  // Priority 2, *, /
  [tokens.Star, tokens.Slash],
  // Priority 3, +, -
  [tokens.Plus, tokens.Minus],
  // Priority 4, ||, !!
  [tokens.PipePipe],
  // Priority 5, '<', '¬<', '<=', '=', '¬=', '^=', '<>', '>=', '>', '¬>'
  [
    tokens.LessThan,
    tokens.NotLessThan,
    tokens.LessThanEquals,
    tokens.Equals,
    tokens.NotEquals,
    tokens.LessThanGreaterThan,
    tokens.GreaterThanEquals,
    tokens.GreaterThan,
    tokens.NotGreaterThan,
  ],
  // Priority 6, &
  [tokens.Ampersand],
  // Priority 7, |, ¬ or ^
  [tokens.Pipe, tokens.Not],
]);

/**
 * Constructs a binary expression from an intermediate representation,
 * used when popping infix exprs from the stack,
 * so we get the whole thing together
 */
export function constructBinaryExpression(
  obj: IntermediateBinaryExpression,
): BinaryExpression {
  if (obj.items.length === 1) {
    // Captured just a single, non-binary expression
    // Simply return the expression as is.
    return obj.items[0];
  }
  // Find the operator with the lowest precedence (highest value in precedence map)
  let lowestPrecedenceIdx = 0;
  let lowestPrecedenceValue = -1;

  for (let i = 0; i < obj.operators.length; i++) {
    const operator = obj.operators[i];
    const precedenceValue =
      binaryPrecedence.get(operator.tokenType.name) ?? Infinity;

    // If we find an operator with lower precedence or equal precedence
    // (for left-to-right evaluation), update our tracking
    if (precedenceValue > lowestPrecedenceValue) {
      lowestPrecedenceValue = precedenceValue;
      lowestPrecedenceIdx = i;
    }
  }

  // Split the expression at the lowest precedence operator
  const leftOperators = obj.operators.slice(0, lowestPrecedenceIdx);
  const rightOperators = obj.operators.slice(lowestPrecedenceIdx + 1);

  const leftParts = obj.items.slice(0, lowestPrecedenceIdx + 1);
  const rightParts = obj.items.slice(lowestPrecedenceIdx + 1);

  // Create sub-expressions
  const leftInfix: IntermediateBinaryExpression = {
    infix: true,
    items: leftParts,
    operators: leftOperators,
  };
  const rightInfix: IntermediateBinaryExpression = {
    infix: true,
    items: rightParts,
    operators: rightOperators,
  };

  // Recursively build the left and right subtrees
  const leftTree = constructBinaryExpression(leftInfix);
  const rightTree = constructBinaryExpression(rightInfix);

  const operatorToken = obj.operators[lowestPrecedenceIdx];

  // Create the final binary expression
  const result: BinaryExpression = {
    kind: SyntaxKind.BinaryExpression,
    container: null,
    left: leftTree,
    op: operatorToken.tokenType.name as BinaryExpression["op"],
    right: rightTree,
  };

  operatorToken.payload.element = result;

  return result;
}
