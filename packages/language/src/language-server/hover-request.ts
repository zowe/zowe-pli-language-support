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
import { getAttributes } from "../preprocessor/util";
import {
  Bound,
  DeclaredVariable,
  DimensionBound,
  Dimensions,
  Expression,
  IncludeItem,
  LabelPrefix,
  ProcedureStatement,
  SyntaxKind,
  SyntaxNode,
  Wildcard,
} from "../syntax-tree/ast";
import { formatPliCodeBlock } from "../utils/code-block";
import { binaryTokenSearch } from "../utils/search";
import { URI } from "../utils/uri";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";
import { CompilationUnit } from "../workspace/compilation-unit";
import { TextDocuments } from "./text-documents";
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
 * Extracts the parameters from a procedure statement as a string.
 * @returns Decoded string representation of parameters or null if any fail to resolve
 */
function extractProcedureParams(
  procedureStatement: ProcedureStatement,
): string | null {
  if (!procedureStatement?.parameters) {
    return "";
  }
  const params: string[] = [];
  for (const param of procedureStatement.parameters) {
    const ref = param.ref;
    if (!ref) {
      // unresolved param, dip out prematurely
      return null;
    }
    params.push(ref.text);
  }
  return params.length ? `(${params.join(",")})` : "";
}

/**
 * Extracts the options from a procedure statement as a string.
 * Handles OPTIONS, ORDER, RECURSIVE, and RETURNS options.
 * If no options are present, returns an empty string.
 * RETURNS options require further decoding of attribute exprs.
 * @returns string representation of options
 */
function extractProcedureOptions(
  procedureStatement: ProcedureStatement,
): string {
  if (!procedureStatement?.options) {
    return "";
  }
  const optionStrings: string[] = [];
  for (const option of procedureStatement.options) {
    if (option.kind === SyntaxKind.Options) {
      // simple options
      const internalOptions: string[] = [];
      for (const item of option.items) {
        if (item.kind === SyntaxKind.SimpleOptionsItem && item.value) {
          internalOptions.push(item.value);
        }
      }
      if (internalOptions.length > 0) {
        optionStrings.push(`OPTIONS(${internalOptions.join(", ")})`);
      }
    } else if (
      option.kind === SyntaxKind.ProcedureOrderOption &&
      option.order
    ) {
      optionStrings.push(option.order);
    } else if (option.kind === SyntaxKind.ProcedureRecursiveOption) {
      optionStrings.push("RECURSIVE");
    } else if (option.kind === SyntaxKind.ReturnsOption) {
      // returns options
      const attrArr: string[] = [];
      const attrs = option.returnAttributes;
      for (const attr of attrs) {
        if (attr.kind === SyntaxKind.ComputationDataAttribute && attr.type) {
          if (attr.dimensions) {
            // type w/ dimens, need to be decoded
            attrArr.push(attr.type + decodeDimensions(attr.dimensions));
          } else {
            // just the type
            attrArr.push(attr.type);
          }
        }
      }
      optionStrings.push(`RETURNS(${attrArr.join(" ")})`);
    }
    // TODO @montymxb add additional options cases as they come up
  }
  return optionStrings.length > 0 ? optionStrings.join(" ") : "";
}

/**
 * Gets the string representation of a label prefix
 * (e.g. procedure currently).
 */
function getLabelPrefixRepresentation(labelPrefix: LabelPrefix): string | null {
  // NOTE: currently assumes we're dealing with a procedure label prefix
  const procedureStatement = retrieveProcedureFromLabelPrefix(labelPrefix);

  if (!procedureStatement) {
    return null;
  }

  // extract params
  const paramsStr = extractProcedureParams(procedureStatement);
  if (paramsStr === null) {
    return null;
  }

  // extract options
  const optionsStr = extractProcedureOptions(procedureStatement);
  if (optionsStr === null) {
    return null;
  }

  return formatPliCodeBlock(
    `${labelPrefix.name ?? ""}: PROC${paramsStr} ${optionsStr};`,
  );
}

/**
 * Helper function for decoding dimensions for hover support
 */
function decodeDimensions(dimensions: Dimensions): string {
  const dimensionBounds: DimensionBound[] = dimensions.dimensions;
  const decodedBounds: string[] = [];
  for (const bound of dimensionBounds) {
    const lower: string | null = decodeBound(bound.lower);
    const upper: string | null = decodeBound(bound.upper);
    decodedBounds.push(`(${[lower, upper].filter((v) => v).join(",")})`);
  }
  return decodedBounds.join("");
}

/**
 * Decodes a bound expression to a string.
 * Handles wildcards and literal expressions.
 * @returns Decoded bound as a string, or null if we encounter a non lit or missing value
 */
function decodeBound(bound: Bound | null): string | null {
  if (!bound || !bound.expression) {
    return null;
  }
  const expr: Wildcard<Expression> = bound.expression;
  if (expr === "*") {
    return "*";
  } else if (expr.kind === SyntaxKind.Literal) {
    return expr.value?.value ?? null;
  } else {
    // fail to decode on non-literal exprs
    return null;
  }
}

/**
 * Converts an IncludeItem node to a string representation.
 * Ex. %INCLUDE "file:///path/to/file.pli"
 */
function getIncludeItemRepresentation(node: IncludeItem): string | null {
  if (!node.filePath) {
    return null;
  }

  let partialContent = node.sourceText;
  const fileUri = URI.parse(node.filePath);

  if (!partialContent) {
    // load up the first 20 lines of content from the file (semi-arbitrary cutoff)
    const lineCutoff = 20;
    const doc = TextDocuments.get(fileUri);
    if (!doc) {
      return null;
    }
    const fileContent = doc.getText({
      start: { line: 0, character: 0 },
      end: { line: lineCutoff + 1, character: 0 },
    });
    const lineCount = fileContent.matchAll(/\n/g);
    partialContent =
      Array.from(lineCount).length > lineCutoff
        ? fileContent + "\n...\n"
        : fileContent;
    // cache for later requests
    node.sourceText = partialContent;
  }
  return `%INCLUDE "${fileUri.fsPath}"\n\n---\n${formatPliCodeBlock(partialContent)}`;
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
