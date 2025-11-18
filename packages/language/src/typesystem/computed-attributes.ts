import { Bound, DimensionBound } from "./descriptions";
import * as ast from "../syntax-tree/ast";
import { evaluateExpression } from "./evaluate";

export function computeDimensions(dimension: ast.Dimensions): Array<DimensionBound> {
    const dims = dimension.dimensions;
    const result: Array<DimensionBound> = [];
    for(const dim of dims) {
        function computeExpression(bound: ast.Bound | undefined | null, defaultValue: number): Bound {
            const expr = bound?.expression;
            if (!expr) {
                return {
                    value: defaultValue,
                    expression: null,
                    refersTo: null,
                };
            }
            if (expr === '*') {
                return {
                    value: '*',
                    expression: expr,
                    refersTo: null,
                };
            }
            const value = evaluateExpression(expr);
            if(typeof value.value === 'number') {
                return {
                    value: value.value,
                    expression: expr,
                    refersTo: null,
                };
            } else {
                return {
                    value: undefined,
                    expression: expr,
                    refersTo: null,
                };
            }
        }
        result.push({
            lowerBound: computeExpression(dim.lower, 1),
            upperBound: computeExpression(dim.upper, 1),
        });
    }
    return result;
}