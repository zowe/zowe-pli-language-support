import { diagnosticFromCode } from "../../language-server/types";
import { ReferenceItem, SyntaxKind } from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { PLICodes } from "../pli-codes";
import { retrieveProcedureFromLabelPrefix } from "../utils";
import { ValidationAcceptor } from "../validator";

export function checkProcedureCallsDimensions(
  node: ReferenceItem,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    node.ref &&
    node.ref.node &&
    node.ref.node.kind === SyntaxKind.LabelPrefix
  ) {
    const procedure = retrieveProcedureFromLabelPrefix(node.ref.node);
    if (procedure && node.dimensions.length > 1) {
      acceptor(
        diagnosticFromCode(
          PLICodes.Severe.IBM1704I,
          node.ref.token,
          node.ref.token.image,
        ),
      );
    }
  }
}
