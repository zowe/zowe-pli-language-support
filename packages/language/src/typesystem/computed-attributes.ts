import { Bound, DimensionBound } from "./descriptions";
import * as ast from "../syntax-tree/ast";
import { evaluateExpression } from "./evaluate";

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=arrays-dimension-attribute */
export function computeDimensions(dimension: ast.Dimensions): Array<DimensionBound> {
    const dims = dimension.dimensions;
    const result: Array<DimensionBound> = [];
    for(const dim of dims) {
        function computeExpression(bound: ast.Bound | undefined | null, defaultValue: number|undefined): Bound {
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
            //If only the upper bound is given, the lower bound defaults to 1.
            lowerBound: computeExpression(dim.lower, 1),
            //No default for upper bound. Assuming undefined in case of a parser error.
            upperBound: computeExpression(dim.upper, undefined),
        });
    }
    return result;
}