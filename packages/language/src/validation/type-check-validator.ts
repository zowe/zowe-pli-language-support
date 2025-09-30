import * as ast from "../syntax-tree/ast";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ValidationAcceptor } from "./validator";

export class TypeCheck {
  constructor(private compilationUnit: CompilationUnit) { }
  checkDeclaredItem(
    declaredItem: ast.DeclaredItem,
    _acceptor: ValidationAcceptor,
  ) {
    this.compilationUnit.services.inferer.inferDeclarationType(declaredItem, this.compilationUnit);
  }
}
