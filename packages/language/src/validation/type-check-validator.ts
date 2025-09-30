import * as ast from "../syntax-tree/ast";
import { DefaultTypeBuilder } from "../typesystem/type-builder";
import { ValidationAcceptor } from "./validator";

export class TypeCheck {
  constructor() {}
  checkDeclareStatement(
    declareStatement: ast.DeclareStatement,
    acceptor: ValidationAcceptor,
  ) {
    for (const item of declareStatement.items) {
      const builder = new DefaultTypeBuilder();
      for (const attribute of item.attributes) {
        builder.addAttribute(attribute);
      }
      const { diagnostics, type: _type } = builder.build();
      for (const diagnostic of diagnostics) {
        acceptor(diagnostic);
      }
      //TODO do something with the built _type
    }
  }
  checkIfStatementConditionIsBoolean(
    ifStatement: ast.IfStatement,
    acceptor: ValidationAcceptor,
  ) {

  }
}
