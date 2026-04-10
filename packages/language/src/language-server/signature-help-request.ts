import { URI } from "vscode-uri";
import type { SignatureHelp } from 'vscode-languageserver';
import { CompilationUnit } from "../workspace/compilation-unit";
import { binaryTokenSearch } from "../utils/search";
import { DimensionBound, getContainer, SyntaxKind } from "../syntax-tree/ast";
import { stringifyDeclaration } from "../typesystem/stringify";
import { getJSDocCommentBeforeLabelPrefix } from "./hover-request";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";

export function signatureHelpRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): SignatureHelp | null {
  const tokens = unit.services.files.getTokens(uri);
  if (!tokens) {
    return null;
  }
  const token = binaryTokenSearch(tokens, offset);
  if (!token) {
    return null;
  }
  const memberCall = getContainer(token.element, SyntaxKind.MemberCall)
  if (!memberCall || !memberCall.element?.ref?.text || !memberCall.element.ref.node || memberCall.element.ref.node.kind !== SyntaxKind.LabelPrefix) {
    return null;
  }
  const jsDoc = getJSDocCommentBeforeLabelPrefix(memberCall.element.ref.node, unit);
  const parameterDocumentation = new Map<string, string>();
  const parameterIndex = getParameterIndexByOffset(memberCall.element.dimensions?.dimensions, offset);
  if (jsDoc) {
    const paramPattern = /^ *\{[^}]+\} *(\w+)/; // extracts the parameter name
    for (const paramTag of jsDoc.getTags("param")) {
      const match = paramTag.content.toString().match(paramPattern);
      if (match) {
        const paramName = match[1].toUpperCase();
        parameterDocumentation.set(paramName, paramTag.content.toMarkdown());
      }
    }
  }
  const procedure = retrieveProcedureFromLabelPrefix(memberCall.element.ref.node);
  if (!procedure) {
    return null;
  }
  const signatureHelp: SignatureHelp = {
    signatures: [{
      label: memberCall.element.ref.text,
      documentation: {
        kind: "markdown",
        value: stringifyDeclaration(memberCall.element.ref.node, unit) ?? ""
      },
      parameters: procedure.parameters.map(p => {
        const name = p.ref?.text?.toUpperCase();
        return {
          label: name ?? "unknown",
          documentation: name && parameterDocumentation.has(name) ? {
            kind: "markdown",
            value: parameterDocumentation.get(name)!
          } : undefined,
        };
      }),
    }],
    activeSignature: 0,
    activeParameter: parameterIndex,
  };
  return signatureHelp;
}

function getParameterIndexByOffset(dimensions: DimensionBound[] | undefined, offset: number) {
  if (!dimensions || dimensions.length === 0) {
    return 0;
  }
  for (let index = 0; index < dimensions.length; index++) {
    const dim = dimensions[index];
    if (dim.startToken && dim.endToken && offset > dim.startToken.endOffset && offset <= dim.endToken.endOffset) {
      return index;
    }
  }
  return 0;
}