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
import {
  CallStatement,
  MemberCall,
  ProcedureStatement,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { BuiltinsUriSchema } from "../../workspace/builtins";
import { PLICodes } from "../pli-codes";
import {
  resolveProcedureFromCall,
  retrieveProcedureFromLabelPrefix,
} from "../utils";
import { ValidationAcceptor } from "../validator";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { TypeDescriptions } from "../../typesystem/descriptions";
import { Token } from "../../parser/tokens";

export function CallStatement_checkArguments(
  node: CallStatement,
  acceptor: ValidationAcceptor,
  unit: CompilationUnit,
): void {
  const procedure = resolveProcedureFromCall(node);
  if (!procedure) {
    return;
  }
  const callToken = node.call!.procedure!.token;
  const {
    minimumExpectedArgs,
    maximumExpectedArgs,
    expectedTypes,
    lastParameterType,
  } = getParameterDetails(procedure, unit);
  const providedArgs = node.call?.args1?.list.length || 0;

  if (providedArgs < minimumExpectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3323I, callToken, callToken.image),
    );
  } else if (providedArgs > maximumExpectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3324I, callToken, callToken.image),
    );
  }

  const providedTypes =
    node.call?.args1?.list.map((d) => {
      if (d === "*") {
        return TypeDescriptions.Unknown();
      }
      return unit.services.inferer.inferType(d, unit);
    }) ?? [];
  checkArgumentTypes(
    providedArgs,
    providedTypes,
    expectedTypes,
    lastParameterType,
    unit,
    acceptor,
    callToken,
  );
}

export function MemberCall_checkArguments(
  node: MemberCall,
  acceptor: ValidationAcceptor,
  unit: CompilationUnit,
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
  //TODO @tag(#issue-656) remove me once ALL built-in procedures signatures are setup
  if (
    procedure.procToken?.uri?.scheme &&
    procedure.procToken.uri.scheme !== BuiltinsUriSchema
  ) {
    return;
  }
  const {
    minimumExpectedArgs,
    maximumExpectedArgs,
    expectedTypes,
    lastParameterType,
  } = getParameterDetails(procedure, unit);
  const providedArgs = node.element.dimensions?.dimensions.length || 0;

  //compare expected and provided argument counts
  if (providedArgs < minimumExpectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Severe.IBM3774I, callToken, callToken.image),
    );
  } else if (providedArgs > maximumExpectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Error.IBM3639I, callToken, callToken.image),
    );
  }

  const providedTypes =
    node.element.dimensions?.dimensions.map((d) =>
      typeof d.upper?.expression === "object" && d.upper?.expression !== null
        ? unit.services.inferer.inferType(d.upper.expression, unit)
        : TypeDescriptions.Unknown(),
    ) ?? [];
  checkArgumentTypes(
    providedArgs,
    providedTypes,
    expectedTypes,
    lastParameterType,
    unit,
    acceptor,
    callToken,
  );
}

function checkArgumentTypes(
  providedArgs: number,
  providedTypes: TypeDescriptions.Any[],
  expectedTypes: TypeDescriptions.Any[],
  lastParameterType: TypeDescriptions.Any,
  unit: CompilationUnit,
  acceptor: ValidationAcceptor,
  callToken: Token,
) {
  for (let index = 0; index < providedArgs; index++) {
    const providedType = providedTypes[index];
    if (index >= expectedTypes.length && !lastParameterType.list) {
      break;
    }
    const expectedType = expectedTypes[index] ?? lastParameterType;
    if (
      providedType &&
      expectedType &&
      !unit.services.inferer.isAssignable(providedType, expectedType, unit)
    ) {
      acceptor(
        diagnosticFromCode(
          PLICodes.Severe.IBM3948I,
          callToken,
          callToken.image,
          "612",
        ),
      );
    }
  }
}

function getParameterDetails(
  procedure: ProcedureStatement,
  unit: CompilationUnit,
) {
  const expectedTypes = procedure.parameters.map((p) =>
    unit.services.inferer.inferType(p, unit),
  );
  const lastParameterType =
    expectedTypes[expectedTypes.length - 1] ?? TypeDescriptions.Unknown();
  const minimumExpectedArgs =
    expectedTypes.filter((t) => !t.optional).length -
    (lastParameterType?.list ? 1 : 0);
  const maximumExpectedArgs = lastParameterType.list
    ? Infinity
    : expectedTypes.length;
  return {
    minimumExpectedArgs,
    maximumExpectedArgs,
    expectedTypes,
    lastParameterType,
  };
}
