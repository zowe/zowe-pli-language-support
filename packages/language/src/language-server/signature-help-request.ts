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
  getContainer,
  LabelPrefix,
  MemberCall,
  ProcedureStatement,
  ReferenceItem,
  SyntaxKind,
} from "../syntax-tree/ast";
import { extractDeclaration } from "../typesystem/stringify";
import { getJSDocCommentBeforeLabelPrefix } from "./hover-request";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";
import { Token } from "../parser/tokens";
import { takeWhile } from "lodash-es";
import { isJSDocParagraph } from "../documentation/jsdoc";
import { TypeDescriptions } from "../typesystem/descriptions";

type ArgumentInfo = {
  startToken: Token | null;
  endToken: Token | null;
  parameterIndex: number;
};

type ParameterInfo = {
  label: string;
  variadic: boolean;
  token: Token | null;
  typeDescription: TypeDescriptions.Any;
};

type CallInfo = {
  procedure: ProcedureStatement;
  parameters: ParameterInfo[];
  arguments: ArgumentInfo[];
  labelPrefix: LabelPrefix;
  argumentIndex: number | null;
};

export function signatureHelpRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): SignatureHelp | null {
  const callInfo = tryGetCallInfo(unit, uri, offset);
  if (!callInfo || callInfo.argumentIndex === null) {
    return null;
  }
  const jsDoc = getJSDocCommentBeforeLabelPrefix(callInfo.labelPrefix, unit);
  const parameterDocumentation = new Map<string, string>();
  if (jsDoc) {
    const paramPattern = /^ *\[?(\w+)\]? */;
    for (const paramTag of jsDoc.getTags("param")) {
      const match = paramTag.content.toString().match(paramPattern);
      if (match) {
        const trimLeftLength = match[0].length;
        const paramName = match[1];
        const paramNameUpper = paramName.toUpperCase();
        const paramType = callInfo.parameters
          .find((p) => p.label === paramNameUpper)!
          .typeDescription.toString();
        parameterDocumentation.set(
          paramName.toUpperCase(),
          `\`${paramName}: ${paramType}\`\n\n${paramTag.content.toMarkdown().substring(trimLeftLength)}`,
        );
      }
    }
  }
  const extracted = extractDeclaration(callInfo.labelPrefix, unit);
  const signature = extracted?.signature ?? "";
  return {
    signatures: [
      {
        label: signature.split("\n")[0] ?? "<unknown>",
        documentation: {
          kind: "markdown",
          value: takeWhile(jsDoc?.elements, isJSDocParagraph)
            .map((p) => p.toMarkdown())
            .join("\n"),
        },
        parameters: callInfo.parameters.map((parameter) => {
          const name = parameter.label.toUpperCase();
          const from = extracted?.startOffset ?? 0;
          const start = parameter.token?.startOffset ?? 0;
          const end = (parameter.token?.endOffset ?? 0) + 1;
          return {
            label: [start - from, end - from],
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
    activeParameter:
      callInfo.argumentIndex < callInfo.arguments.length
        ? callInfo.arguments[callInfo.argumentIndex].parameterIndex
        : 0,
  };
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
  if (!memberCall) {
    return null;
  }
  return getCallInfoFromMemberCall(memberCall, offset, unit);
}

function getCallInfoFromMemberCall(
  memberCall: MemberCall,
  offset: number,
  unit: CompilationUnit,
): CallInfo | null {
  let call: MemberCall | null = memberCall;
  while (call && call.element) {
    const callInfo = getCallInfoFromReferenceItem(call.element, offset, unit);
    if (callInfo && callInfo.argumentIndex !== null) {
      return callInfo;
    }
    call = getContainer(call.container, SyntaxKind.MemberCall);
  }
  return null;
}

function getCallInfoFromReferenceItem(
  referenceItem: ReferenceItem,
  offset: number,
  unit: CompilationUnit,
): CallInfo | null {
  if (
    !referenceItem.ref?.text ||
    !referenceItem.ref.node ||
    referenceItem.ref.node.kind !== SyntaxKind.LabelPrefix
  ) {
    return null;
  }
  const procedure = retrieveProcedureFromLabelPrefix(referenceItem.ref.node);
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
        token: parameter?.ref?.token ?? null,
        typeDescription: parameterType,
      });
    }
  }
  let parameterIndex = 0;
  const argumentsInfo: ArgumentInfo[] = [];
  if (referenceItem.dimensions.length === 1) {
    for (
      let index = 0;
      index < referenceItem.dimensions[0].dimensions.length;
      index++
    ) {
      const dim = referenceItem.dimensions[0].dimensions[index];
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
    labelPrefix: referenceItem.ref.node,
    argumentIndex,
  };
}

function getArgumentIndexByOffset(
  dimensions: ArgumentInfo[] | undefined,
  offset: number,
) {
  if (!dimensions) {
    return null;
  }
  if (dimensions.length === 0) {
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
    //for incomplete signatures, where the endToken is missing
    if (
      dim.endToken === null &&
      dim.startToken &&
      offset > dim.startToken.endOffset
    ) {
      return index;
    }
  }
  return null;
}
