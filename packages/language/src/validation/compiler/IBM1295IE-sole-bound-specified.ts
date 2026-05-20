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
  fullCode,
  getSyntaxNodeRange,
  Severity,
} from "../../language-server/types";
import {
  Bound,
  DimensionBound,
  SyntaxKind,
  UnaryOperator,
} from "../../syntax-tree/ast";
import { ValidationAcceptor } from "../validator";
import { Error } from "../pli-codes";

export function IBM1295IE_sole_bound_specified(
  bound: DimensionBound,
  accept: ValidationAcceptor,
): void {
  if (bound.lower !== undefined) {
    return;
  }
  const upper = bound.upper;
  if (isBoundNegative(upper) || isBoundZero(upper)) {
    const code = Error.IBM1295I;
    accept({
      severity: Severity.E,
      message: code.message,
      range: getSyntaxNodeRange(bound),
      uri: "", // TODO: Add URI
      code: fullCode(code),
    });
  }
}

function isBoundNegative(bound: Bound | null) {
  return (
    bound &&
    bound.expression?.kind === SyntaxKind.UnaryExpression &&
    bound.expression.op === UnaryOperator.Minus &&
    bound.expression.expr &&
    bound.expression.expr.kind === SyntaxKind.NumberLiteral
  );
}

function isBoundZero(bound: Bound | null): boolean {
  return (bound &&
    bound.expression?.kind === SyntaxKind.NumberLiteral &&
    bound.expression.value !== null &&
    parseInt(bound.expression.value, 10) === 0)!!;
}
