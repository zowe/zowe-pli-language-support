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

import { MarkupKind } from "vscode-languageserver-types";
import { QualifiedSyntaxNode } from "../linking/qualified-syntax-node";
import {
  getReference,
  isIncludeItemToken,
  isNameToken,
  isReferenceToken,
} from "../linking/tokens";
import { Token } from "../parser/tokens";
import { getAttributes } from "../preprocessor/instruction-generator";
import {
  DeclaredVariable,
  IncludeItem,
  LabelPrefix,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { formatPliCodeBlock } from "../utils/code-block";
import { binaryTokenSearch } from "../utils/search";
import { URI } from "../utils/uri";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";
import { CompilationUnit } from "../workspace/compilation-unit";
import { HoverResponse, tokenToRange } from "./types";

type MarkupResponse = string | null;

interface MarkupGeneratorContext {
  unit: CompilationUnit;
  token: Token;
}

interface MarkupGenerator {
  (context: MarkupGeneratorContext): MarkupResponse;
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

  if (qualifiedNode.level > 1) {
    // structure member
    const hierarchy: string[] = [];
    let current: QualifiedSyntaxNode | null = qualifiedNode;
    while (current) {
      hierarchy.unshift(`${current.level} ${current.name}`);
      current = current.getParent();
    }
    return formatPliCodeBlock(`DCL ${hierarchy.join(", ")};`);
  } else {
    // regular declaration
    const name = node.name;
    const attrs = getAttributes(node);
    const decl = attrs.length
      ? `DCL ${name} ${attrs.join(" ")};`
      : `DCL ${name};`;
    return formatPliCodeBlock(decl);
  }
}

/**
 * Retrieves string rep for a label prefix
 * Ex. "MyLabel: PROC;"
 */
function getLabelPrefixRepresentation(labelPrefix: LabelPrefix): string | null {
  // currently assumes we're dealing with a procedure label prefix
  const procedureStatement = retrieveProcedureFromLabelPrefix(labelPrefix);

  if (!procedureStatement) {
    return null;
  }

  const name = labelPrefix.name ?? "<unnamed>";
  const optionStrings: string[] = [];
  for (const option of procedureStatement.options) {
    if (option.kind === SyntaxKind.Options) {
      const internalOptions: string[] = [];
      for (const item of option.items) {
        if (item.kind === SyntaxKind.SimpleOptionsItem && item.value) {
          internalOptions.push(item.value);
        }
      }
      if (internalOptions.length > 0) {
        optionStrings.push(`OPTIONS(${internalOptions.join(", ")})`);
      }
    } else if (option.kind === SyntaxKind.ProcedureOrderOption) {
      if (option.order) {
        optionStrings.push(option.order);
      }
    } else if (option.kind === SyntaxKind.ProcedureRecursiveOption) {
      optionStrings.push("RECURSIVE");
    }
    // TODO @montymxb add additional procedure cases cases as they come up
  }
  const options = optionStrings.length > 0 ? optionStrings.join(" ") : "";
  return formatPliCodeBlock(`${name}: PROC ${options};`);
}

/**
 * Converts an IncludeItem node to a string representation.
 * Ex. %INCLUDE "file:///path/to/file.pli"
 */
function getIncludeItemRepresentation(node: IncludeItem): string {
  const filePath = node.filePath ?? "<unknown>";
  return formatPliCodeBlock(`%INCLUDE "${filePath}"`);
}

/**
 * Get the string representation of a node based on its kind.
 */
function getNodeRepresentation(
  unit: CompilationUnit,
  node: SyntaxNode,
): string | null {
  switch (node.kind) {
    case SyntaxKind.DeclaredVariable:
      return getDeclaredVariableRepresentation(unit, node);
    case SyntaxKind.LabelPrefix:
      return getLabelPrefixRepresentation(node);
    case SyntaxKind.IncludeItem:
      return getIncludeItemRepresentation(node);
    default:
      return null;
  }
}

/**
 * Generates markup from a reference token
 * @returns Markup or null if not applicable
 */
const generateReferenceTokenMarkup: MarkupGenerator = ({ unit, token }) => {
  if (!isReferenceToken(token.kind) || !token.element) {
    return null;
  }

  const ref = getReference(token.element);
  if (!ref?.node) {
    return null;
  }

  return getNodeRepresentation(unit, ref.node);
};

/**
 * Generates markup from an include item token
 * @returns Markup or null if not applicable
 */
const generateIncludeItemTokenMarkup: MarkupGenerator = ({ unit, token }) => {
  if (token.element && isIncludeItemToken(token.kind)) {
    return getNodeRepresentation(unit, token.element);
  }
  return null;
};

/**
 * Generates markup from a name token
 * @returns Markup or null if not applicable
 */
const generateNameTokenMarkup: MarkupGenerator = ({ unit, token }) => {
  if (token.element && isNameToken(token.kind)) {
    return getNodeRepresentation(unit, token.element);
  }
  return null;
};

/**
 * Generates hover content based on the provided generators and context.
 * Returns an array of all non-null results from all generators.
 */
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
  const tokens = unit.tokens.fileTokens.get(uri.toString());
  if (!tokens) {
    return null;
  }
  const token = binaryTokenSearch(tokens, offset);
  if (!token) {
    return null;
  }

  const generators: MarkupGenerator[] = [
    generateReferenceTokenMarkup,
    generateIncludeItemTokenMarkup,
    generateNameTokenMarkup,
  ];
  const context: MarkupGeneratorContext = { unit, token };

  // attempt to generate markup using these generators
  // all matching generators will produce a response here
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
