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
import { Bound, DimensionBound } from "./descriptions";
import * as ast from "../syntax-tree/ast";
import { evaluateExpression } from "./evaluate";

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=arrays-dimension-attribute */
export function computeDimensions(dimension: ast.Dimensions): DimensionBound[] {
  const dims = dimension.dimensions;
  const result: Array<DimensionBound> = [];
  for (const dim of dims) {
    function computeExpression(
      bound: ast.Bound | undefined | null,
      defaultValue: number | undefined,
    ): Bound {
      const expr = bound?.expression;
      if (!expr) {
        return {
          value: defaultValue,
          expression: null,
          refersTo: null,
          node: dim,
          token: bound?.token || null,
        };
      }
      if (expr.kind === ast.SyntaxKind.WildcardItem) {
        return {
          value: "*",
          expression: expr,
          refersTo: null,
          node: dim,
          token: bound?.token || null,
        };
      }
      const value = evaluateExpression(expr);
      if (typeof value.value === "number") {
        return {
          value: value.value,
          expression: expr,
          refersTo: null,
          node: dim,
          token: bound?.token || null,
        };
      } else {
        return {
          value: undefined,
          expression: expr,
          refersTo: null,
          node: dim,
          token: bound?.token || null,
        };
      }
    }
    result.push({
      //If only the upper bound is given, the lower bound defaults to 1.
      lowerBound: computeExpression(dim.lower, 1),
      //No default for upper bound. Assuming undefined in case of a parser error.
      upperBound: computeExpression(dim.upper, undefined),
    });
  }
  return result;
}
