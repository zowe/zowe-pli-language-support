import { diagnosticFromCode } from "../language-server/types";
import * as ast from "../syntax-tree/ast";
import { DataType, ScaleMode } from "../typesystem/descriptions";
import { PliTypeInferer } from "../typesystem/infer";
import { DefaultTypeBuilder } from "../typesystem/type-builder";
import { ValidationAcceptor } from "./validator";

export class TypeCheck {
    constructor(private inferer: PliTypeInferer) {}
    checkDeclareStatement(declareStatement: ast.DeclareStatement, acceptor: ValidationAcceptor) {
        for (const item of declareStatement.items) {
            const builder = new DefaultTypeBuilder();
            for (const attribute of item.attributes) {
                builder.addAttribute(attribute);
            }
            const { diagnostics } = builder.build();
            for (const diagnostic of diagnostics) {
                acceptor(diagnostic);
            }
            //TODO do something with the built type
        }
    }
    checkIfStatementConditionIsBoolean(ifStatement: ast.IfStatement, acceptor: ValidationAcceptor) {
        if(!this.isExpressionBoolean(ifStatement.expression!)) {
            //acceptor(diagnosticFromCode());
        }
    }
    private isExpressionBoolean(node: ast.Expression): boolean {
        const inferredType = this.inferer.inferExpressionType(node);
        if(!inferredType) {
            return false;
        }
        if(inferredType.type === DataType.Arithmetic && inferredType.scale.mode === ScaleMode.Fixed && inferredType.scale.totalDigitsCount === 1) {
            return true;
        }
        return false;
    }
}
