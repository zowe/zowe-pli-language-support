/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
import { diagnosticFromCode } from "../../language-server/types";
import { CallStatement, MemberCall, SyntaxKind } from "../../syntax-tree/ast";
import { BuiltinsUriSchema } from "../../workspace/builtins";
import { PLICodes } from "../pli-codes";
import {
  resolveProcedureFromCall,
  retrieveProcedureFromLabelPrefix,
} from "../utils";
import { ValidationAcceptor } from "../validator";

export function IBM3323I_IBM3324I_check_argument_count(
  node: CallStatement,
  acceptor: ValidationAcceptor,
): void {
  const procedure = resolveProcedureFromCall(node);
  if (!procedure) {
    return;
  }
  const callToken = node.call!.procedure!.token;
  const expectedArgs = procedure.parameters.length;
  const providedArgs = node.call?.args1?.list.length || 0;

  if (providedArgs < expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3323I, callToken, callToken.image),
    );
  } else if (providedArgs > expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3324I, callToken, callToken.image),
    );
  }
}

export function MemberCall_checkArgumentCount(
  node: MemberCall,
  acceptor: ValidationAcceptor,
): void {
  if (
    node.element?.kind !== SyntaxKind.ReferenceItem ||
    !node.element ||
    !node.element.ref
  ) {
    return;
  }
  const callToken = node.element.ref.token;
  const labelPrefix = node.element.ref.node;
  if (!labelPrefix || labelPrefix.kind !== SyntaxKind.LabelPrefix) {
    return;
  }
  const procedure = retrieveProcedureFromLabelPrefix(labelPrefix);
  if (!procedure) {
    return;
  }
  if (
    procedure.procToken?.uri?.scheme &&
    procedure.procToken.uri.scheme !== BuiltinsUriSchema
  ) {
    return;
  }
  const expectedArgs = procedure.parameters.length;
  const providedArgs = node.element.dimensions?.dimensions.length || 0;
  if (providedArgs < expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Severe.IBM3774I, callToken, callToken.image),
    );
  } else if (providedArgs > expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Error.IBM3639I, callToken, callToken.image),
    );
  }
}
