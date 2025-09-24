import { diagnosticFromCode } from "../language-server/types";
import * as ast from "../syntax-tree/ast";
import { DataType, ScaleMode } from "../typesystem/descriptions";
import { PliTypeInferer } from "../typesystem/infer";
import { ValidationAcceptor } from "./validator";

export class TypeCheck {
    constructor(private inferer: PliTypeInferer) {}
    checkIfStatementConditionIsBoolean(ifStatement: ast.IfStatement, acceptor: ValidationAcceptor) {
        if(!this.isExpressionBoolean(ifStatement.expression!)) {
            //acceptor(diagnosticFromCode());
        }
    }
    private isExpressionBoolean(node: ast.Expression): boolean {
        const inferredType = this.inferer.inferType(node);
        if(!inferredType) {
            return false;
        }
        if(inferredType.type === DataType.Arithmetic && inferredType.scale.mode === ScaleMode.Fixed && inferredType.scale.totalDigitsCount === 1) {
            return true;
        }
        return false;
    }
}
