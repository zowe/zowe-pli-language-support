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

import { CompilationUnit } from "../workspace/compilation-unit";
import { binaryTokenSearch } from "../utils/search";
import { Range, tokenToRange } from "./types";
import { URI } from "../utils/uri";
import { MarkupContent, MarkupKind } from "vscode-languageserver-types";
import { getReference, isReferenceToken } from "../linking/tokens";
import { TokenPayload } from "../parser/tokens";
import { DeclaredVariable, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { formatPliCodeBlock } from "../utils/code-block";
import { QualifiedSyntaxNode } from "../linking/qualified-syntax-node";

interface HoverResponse {
  range?: Range;
  contents: MarkupContent;
}

type MarkupResponse = string | null;

function getParents(node: QualifiedSyntaxNode): QualifiedSyntaxNode[] {
  const parent = node.getParent();
  if (!parent) {
    return [];
  }

  return [...getParents(parent), parent];
}

function getQualifiedNodeRepresentation(node: QualifiedSyntaxNode): string {
  return `${node.level} ${node.name}`;
}

function getDeclaredVariableRepresentation(
  unit: CompilationUnit,
  node: DeclaredVariable,
): string {
  const qualifiedNode = unit.scopeCaches.regular
    .get(node)
    ?.symbolTable.nodeLookup.get(node);
  if (!qualifiedNode) {
    return "Qualified node not found";
  }

  const parents = getParents(qualifiedNode).map(getQualifiedNodeRepresentation);
  const elements = [...parents, getQualifiedNodeRepresentation(qualifiedNode)];

  return formatPliCodeBlock(`DCL ${elements.join(", ")}`);
}

function getNodeRepresentation(
  unit: CompilationUnit,
  node: SyntaxNode,
): string | null {
  switch (node.kind) {
    case SyntaxKind.DeclaredVariable:
      return getDeclaredVariableRepresentation(unit, node);
    default:
      return null;
  }
}

function getReferenceTokenContent(
  unit: CompilationUnit,
  payload: TokenPayload,
): MarkupResponse {
  if (!isReferenceToken(payload.kind) || !payload.element) {
    return null;
  }

  const ref = getReference(payload.element);
  if (!ref?.node) {
    return null;
  }

  return getNodeRepresentation(unit, ref.node);
}

export function hoverRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): HoverResponse | null {
  const tokens = unit.tokens.fileTokens[uri.toString()] ?? [];
  const token = binaryTokenSearch(tokens, offset);
  const payload = token?.payload;
  if (!payload) {
    return null;
  }

  const responses: MarkupResponse[] = [getReferenceTokenContent(unit, payload)];

  const value = responses
    .filter((response): response is string => response !== null)
    .join("\n\n");

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value,
    },
    range: tokenToRange(token),
  };
}
