import { IBM3323I_IBM3324I_check_argument_count } from "./compiler/IBM3323I-IBM3324I-check-argument-count";
import { IBM3970IS_IBM3971IS_check_pp_call_procedure } from "./compiler/IBM3970-IBM3971-call-procedure";
import { MACRO_Deprecate } from "./macro/deprecate";
import { MACRO_NamePrefix } from "./macro/nameprefix";
import { MACRO_Case } from "./macro/case";
import { ValidationAcceptor, ValidationChecks } from "./validator";
import { IBM1352IE_declared_item_pp_scan_repetition } from "./compiler/IBM1352IE-declare-item-scan-repetition";
import { LSPIS001_standalone_skip_directive_not_supported } from "./language-server/LSPIS001-skip-statement-not-supported";
import { DeprecateIncludes } from "./compiler/IBM2444Iff-deprecate";
import {
  SqlAttributeStatement,
  SqlAttributeType,
  SyntaxKind,
} from "../syntax-tree/ast";
import { CompilationUnit } from "../workspace/compilation-unit";
import { diagnosticFromCode } from "../language-server/types";
import { PLICodes } from "./pli-codes";

export function registerPreprocessorValidationChecks(): ValidationChecks {
  return {
    CallStatement: [
      IBM3323I_IBM3324I_check_argument_count,
      IBM3970IS_IBM3971IS_check_pp_call_procedure,
    ],
    DeclaredItem: [IBM1352IE_declared_item_pp_scan_repetition],
    DeclaredVariable: [MACRO_NamePrefix],
    IncludeDirective: [DeprecateIncludes],
    Program: [MACRO_Case],
    ProcedureStatement: [MACRO_Deprecate, MACRO_NamePrefix],
    SkipDirective: [LSPIS001_standalone_skip_directive_not_supported],
    SqlAttributeStatement: [XML_Locator_Check],
  };
}

function isLocator(node: SqlAttributeType): boolean {
  return (
    node.kind === SyntaxKind.SqlAttributeLobLocator ||
    node.kind === SyntaxKind.SqlAttributeTableLocator ||
    node.kind === SyntaxKind.SqlAttributeResultSetLocator
  );
}

function XML_Locator_Check(
  node: SqlAttributeStatement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (node.isXml && node.body && isLocator(node.body) && node.xmlToken) {
    acceptor(diagnosticFromCode(PLICodes.Severe.IBM3783I, node.xmlToken));
  }
}
