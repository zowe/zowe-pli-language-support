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

import { ValidationAcceptor } from "langium";
import { Bound, DimensionBound, isLiteral, isNumberLiteral, isUnaryExpression } from "../../generated/ast";

export function IBM1295IE_sole_bound_specified(bound: DimensionBound, accept: ValidationAcceptor): void {
    if(bound.bound2 !== undefined) {
        return;
    }
    const upper = bound.bound1;
    if(isBoundNegative(upper) || isBoundZero(upper)) {
        accept("error", "Sole bound specified is less than 1. An upper bound of 1 is assumed.", {
            node: bound,
            property: "bound1",
            code: "IBM1295IE"
        });
    }
}

function isBoundNegative(bound: Bound) {
    return bound.expression !== '*'
        && isUnaryExpression(bound.expression)
        && bound.expression.op === '-'
        && isLiteral(bound.expression.expr)
        && isNumberLiteral(bound.expression.expr.value);
}

function isBoundZero(bound: Bound): boolean {
    return bound.expression !== '*'
        && isLiteral(bound.expression)
        && isNumberLiteral(bound.expression.value)
        //TODO find other cases when it is zero
        && bound.expression.value.value === '0';
}
