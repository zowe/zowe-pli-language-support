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

import { URI } from "vscode-uri";
import type { SignatureHelp } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { binaryTokenIndexRightMost } from "../utils/search";
import {
  CallStatement,
  getContainer,
  LabelPrefix,
  MemberCall,
  ProcedureStatement,
  SyntaxKind,
} from "../syntax-tree/ast";
import { stringifyDeclaration } from "../typesystem/stringify";
import { getJSDocCommentBeforeLabelPrefix } from "./hover-request";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";
import { Token } from "../parser/tokens";
import { assertType } from "../preprocessor/util";

type ArgumentInfo = {
  startToken: Token | null;
  endToken: Token | null;
  parameterIndex: number;
};

type ParameterInfo = {
  label: string;
  variadic: boolean;
};

type CallInfo = {
  procedure: ProcedureStatement;
  parameters: ParameterInfo[];
  arguments: ArgumentInfo[];
  labelPrefix: LabelPrefix;
  argumentIndex: number;
};

export function signatureHelpRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): SignatureHelp | null {
  const callInfo = tryGetCallInfo(unit, uri, offset);
  if (!callInfo) {
    return null;
  }
  const jsDoc = getJSDocCommentBeforeLabelPrefix(callInfo.labelPrefix, unit);
  const parameterDocumentation = new Map<string, string>();
  if (jsDoc) {
    const paramPattern = /^ *\{[^}]+\} *\[?(\w+)/; // extracts the parameter name
    for (const paramTag of jsDoc.getTags("param")) {
      const match = paramTag.content.toString().match(paramPattern);
      if (match) {
        const paramName = match[1].toUpperCase();
        parameterDocumentation.set(paramName, paramTag.content.toMarkdown());
      }
    }
  }
  const signatureHelp: SignatureHelp = {
    signatures: [
      {
        label: callInfo.labelPrefix.name ?? "<unknown>",
        documentation: {
          kind: "markdown",
          value: stringifyDeclaration(callInfo.labelPrefix, unit) ?? "",
        },
        parameters: callInfo.parameters.map((parameter) => {
          const name = parameter.label.toUpperCase();
          return {
            label: name ?? "unknown",
            documentation:
              name && parameterDocumentation.has(name)
                ? {
                    kind: "markdown",
                    value: parameterDocumentation.get(name)!,
                  }
                : undefined,
          };
        }),
      },
    ],
    activeSignature: 0,
    activeParameter: callInfo.arguments[callInfo.argumentIndex].parameterIndex,
  };
  return signatureHelp;
}

function tryGetCallInfo(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): CallInfo | null {
  const tokens = unit.services.files.getTokens(uri);
  if (!tokens) {
    return null;
  }
  const tokenIndex = binaryTokenIndexRightMost(tokens, offset);
  if (tokenIndex === -1) {
    return null;
  }
  const token = tokens[tokenIndex];
  if (!token) {
    return null;
  }
  const memberCall = getContainer(token.element, SyntaxKind.MemberCall);
  const callStatement = getContainer(token.element, SyntaxKind.CallStatement);
  if (!memberCall && !callStatement) {
    return null;
  }
  if (memberCall && !callStatement) {
    return getCallInfoFromMemberCall(memberCall, offset, unit);
  }
  if (callStatement && !memberCall) {
    return getCallInfoFromCallStatement(callStatement, offset, unit);
  }
  assertType<MemberCall>(memberCall);
  assertType<CallStatement>(callStatement);
  const callStatementOffset = callStatement.call?.procedure?.token.startOffset;
  const memberCallOffset = memberCall.element?.ref?.token.startOffset;
  if (callStatementOffset === undefined || memberCallOffset === undefined) {
    return null;
  }
  if (callStatementOffset > memberCallOffset) {
    return getCallInfoFromCallStatement(callStatement, offset, unit);
  } else {
    return getCallInfoFromMemberCall(memberCall, offset, unit);
  }
}

function getCallInfoFromCallStatement(
  callStatement: CallStatement,
  offset: number,
  unit: CompilationUnit,
): CallInfo | null {
  if (
    !callStatement.call?.procedure?.text ||
    !callStatement.call.procedure.node ||
    callStatement.call.procedure.node.kind !== SyntaxKind.LabelPrefix
  ) {
    return null;
  }
  const procedure = retrieveProcedureFromLabelPrefix(
    callStatement.call.procedure.node,
  );
  if (!procedure) {
    return null;
  }
  const parameterInfo: ParameterInfo[] = [];
  if (procedure.parameters) {
    for (const parameter of procedure.parameters) {
      const parameterType = unit.services.inferer.inferType(parameter, unit);
      parameterInfo.push({
        label: parameter?.ref?.text ?? "<unknown>",
        variadic: parameterType.list,
      });
    }
  }
  let parameterIndex = 0;
  const argumentsInfo: ArgumentInfo[] = [];
  if (callStatement.call.args1) {
    for (
      let index = 0;
      index < callStatement.call.args1.bounds.length;
      index++
    ) {
      const bounds = callStatement.call.args1.bounds[index];
      argumentsInfo.push({
        startToken: bounds.startToken,
        endToken: bounds.endToken,
        parameterIndex,
      });
      if (
        parameterIndex < parameterInfo.length &&
        !parameterInfo[parameterIndex].variadic
      ) {
        parameterIndex++;
      }
    }
  }
  const argumentIndex = getArgumentIndexByOffset(argumentsInfo, offset);
  return {
    procedure,
    arguments: argumentsInfo,
    parameters: parameterInfo,
    labelPrefix: callStatement.call.procedure.node,
    argumentIndex,
  };
}

function getCallInfoFromMemberCall(
  memberCall: MemberCall,
  offset: number,
  unit: CompilationUnit,
): CallInfo | null {
  if (
    !memberCall.element?.ref?.text ||
    !memberCall.element.ref.node ||
    memberCall.element.ref.node.kind !== SyntaxKind.LabelPrefix
  ) {
    return null;
  }
  const procedure = retrieveProcedureFromLabelPrefix(
    memberCall.element.ref.node,
  );
  if (!procedure) {
    return null;
  }
  const parameterInfo: ParameterInfo[] = [];
  if (procedure.parameters) {
    for (const parameter of procedure.parameters) {
      const parameterType = unit.services.inferer.inferType(parameter, unit);
      parameterInfo.push({
        label: parameter?.ref?.text ?? "<unknown>",
        variadic: parameterType.list,
      });
    }
  }
  let parameterIndex = 0;
  const argumentsInfo: ArgumentInfo[] = [];
  if (memberCall.element.dimensions) {
    for (
      let index = 0;
      index < memberCall.element.dimensions.dimensions.length;
      index++
    ) {
      const dim = memberCall.element.dimensions.dimensions[index];
      argumentsInfo.push({
        startToken: dim.startToken,
        endToken: dim.endToken,
        parameterIndex,
      });
      if (
        parameterIndex < parameterInfo.length &&
        !parameterInfo[parameterIndex].variadic
      ) {
        parameterIndex++;
      }
    }
  }
  const argumentIndex = getArgumentIndexByOffset(argumentsInfo, offset);
  return {
    procedure,
    parameters: parameterInfo,
    arguments: argumentsInfo,
    labelPrefix: memberCall.element.ref.node,
    argumentIndex,
  };
}

function getArgumentIndexByOffset(
  dimensions: ArgumentInfo[] | undefined,
  offset: number,
) {
  if (!dimensions || dimensions.length === 0) {
    return 0;
  }
  for (let index = 0; index < dimensions.length; index++) {
    const dim = dimensions[index];
    if (
      dim.startToken &&
      dim.endToken &&
      offset > dim.startToken.endOffset &&
      offset <= dim.endToken.endOffset
    ) {
      return index;
    }
  }
  return 0;
}
