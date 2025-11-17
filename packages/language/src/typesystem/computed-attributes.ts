import { DimensionBound } from "../../test/fourslash-harness/harness-interface";
import { DataType, TypeDescriptions } from "./descriptions";
import * as ast from "../syntax-tree/ast";
import { evaluateExpression } from "./evaluate";
import { assertType } from "../preprocessor/util";

export function computeDimensions(description: TypeDescriptions.Any): Array<DimensionBound> | undefined {
    if(description.type === DataType.Structure || description.type === DataType.Unknown || !description.dimension) {
        return undefined;
    }
    const dims = description.dimension.dimensions;
    const result: Array<DimensionBound> = [];
    for(const dim of dims) {
        function computeExpression(expr: ast.Wildcard<ast.Expression> | undefined | null, fallback: number): number|'*' {
            if (!expr) {
                return fallback;
            }
            if (expr === '*') {
                return '*';
            }
            const value =  evaluateExpression(expr);
            assertType<ast.SyntaxKind.NumberLiteral>(value.type);
            return value.value as number;
        }
        result.push({
            lowerBound: computeExpression(dim.lower?.expression, 1),
            upperBound: computeExpression(dim.upper?.expression, 0),
        });
    }
    return result;
}