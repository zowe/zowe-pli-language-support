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

import { getSyntaxNodeRange, Severity } from "../../language-server/types";
import { Bound, DimensionBound, SyntaxKind } from "../../syntax-tree/ast";
import { PliValidationAcceptor } from "../validator";
import { Error } from "./pli-codes";

export function IBM1295IE_sole_bound_specified(
  bound: DimensionBound,
  accept: PliValidationAcceptor,
): void {
  if (bound.bound2 !== undefined) {
    return;
  }
  const upper = bound.bound1;
  if (isBoundNegative(upper) || isBoundZero(upper)) {
    const code = Error.IBM1295I;
    accept(Severity.E, code.message, {
    //   node: bound
      range: getSyntaxNodeRange(bound)!,
      uri: "", // TODO: Add URI
    //   property: "bound1",
      code: code.fullCode,
    });
  }
}

function isBoundNegative(bound: Bound | null) {
  return (
    bound &&
    bound.expression !== "*" &&
    bound.expression?.kind === SyntaxKind.UnaryExpression &&
    bound.expression.op === "-" &&
    bound.expression.expr &&
    bound.expression.expr.kind === SyntaxKind.Literal &&
    bound.expression.expr.value &&
    bound.expression.expr.value.kind === SyntaxKind.NumberLiteral
  );
}

function isBoundZero(bound: Bound | null): boolean {
  return (
    bound &&
    bound.expression &&
    bound.expression !== "*" &&
    bound.expression.kind === SyntaxKind.Literal &&
    bound.expression.value &&
    bound.expression.value.kind === SyntaxKind.NumberLiteral &&
    //TODO find other cases when it is zero
    bound.expression.value.value === "0"
  )!!;
}
