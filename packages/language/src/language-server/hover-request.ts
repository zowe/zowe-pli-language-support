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

interface MarkupGeneratorContext {
  unit: CompilationUnit;
  payload: TokenPayload;
}

interface MarkupGenerator {
  (context: MarkupGeneratorContext): MarkupResponse;
}

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

/**
 * Generates a string representation of a declared variable.
 *
 * @param unit - The compilation unit containing the declared variable.
 * @param node - The declared variable node to generate a representation for.
 * @returns A string representation of the declared variable.
 * @throws An error if the qualified node is not found.
 */
function getDeclaredVariableRepresentation(
  unit: CompilationUnit,
  node: DeclaredVariable,
): string {
  const qualifiedNode = unit.scopeCaches.regular
    .get(node)
    ?.symbolTable.nodeLookup.get(node);
  if (!qualifiedNode) {
    throw new Error("Qualified node not found");
  }

  const parents = getParents(qualifiedNode).map(getQualifiedNodeRepresentation);
  const elements = [...parents, getQualifiedNodeRepresentation(qualifiedNode)];

  return formatPliCodeBlock(`DCL ${elements.join(", ")};`);
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

const getReferenceTokenContent: MarkupGenerator = ({ unit, payload }) => {
  if (!isReferenceToken(payload.kind) || !payload.element) {
    return null;
  }

  const ref = getReference(payload.element);
  if (!ref?.node) {
    return null;
  }

  return getNodeRepresentation(unit, ref.node);
};

function generateMarkup(
  generators: MarkupGenerator[],
  context: MarkupGeneratorContext,
): MarkupResponse[] {
  const tryGenerate = (generator: MarkupGenerator) => {
    try {
      return generator(context);
    } catch {
      return null;
    }
  };

  return generators
    .map(tryGenerate)
    .filter((response): response is string => response !== null);
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

  const generators: MarkupGenerator[] = [getReferenceTokenContent];
  const context: MarkupGeneratorContext = { unit, payload };

  const responses = generateMarkup(generators, context);
  const value = responses.join("\n\n");

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value,
    },
    range: tokenToRange(token),
  };
}
