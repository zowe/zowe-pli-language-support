import { diagnosticFromCode, Severity } from "../../language-server/types";
import { BuiltinsUriSchema, KNOWN_BUILTINS } from "../../workspace/builtins";
import { PLICodes } from "../pli-codes";
import * as AST from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { ValidationAcceptor } from "../validator";

// Builtins after this offset are valid to be used even if not listed
let knownBuiltinsOffset = 0;

export function checkImplicitBuiltins(
  compilationUnit: CompilationUnit,
  node: AST.ReferenceItem,
  acceptor: ValidationAcceptor,
): void {
  // Skip if there is no process group information available.
  if (!compilationUnit.processGroup) {
    return;
  }

  // Check for present name
  if (!node.ref?.node?.name) {
    return;
  }

  const nameToken = node.ref?.node?.nameToken;
  const uri = nameToken?.uri;

  // Check if the reference item is a builtin.
  if (!nameToken || !uri || uri?.scheme !== BuiltinsUriSchema) {
    return;
  }

  // This is a rather hacky way to determine what are "valid" builtins
  // We should have a separate file for that
  // TODO: Refactor this, probably when fixing the LSP features for builtins
  if (knownBuiltinsOffset === 0) {
    const file = compilationUnit.services.files.getDocument(uri);
    if (!file) {
      return;
    }
    const text = file.getText();
    knownBuiltinsOffset = text.indexOf(KNOWN_BUILTINS);
  }

  const name = nameToken.image;
  if (
    nameToken.startOffset < knownBuiltinsOffset &&
    !compilationUnit.processGroup.implicitBuiltins.has(name)
  ) {
    acceptor({
      ...diagnosticFromCode(
        PLICodes.Error.IBM1373I,
        node.ref.token,
        node.ref.text,
      ),
      severity: Severity.W, // Downgrade to a warning.
    });
  }
}
