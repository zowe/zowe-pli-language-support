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
import {
  getReference,
  isIncludeItemToken,
  isNameToken,
  isReferenceToken,
} from "../linking/tokens";
import * as t from "../parser/tokens";
import {
  Bound,
  DeclaredVariable,
  DimensionBound,
  Dimensions,
  LabelPrefix,
  ProcedureStatement,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { formatPliCodeBlock } from "../utils/code-block";
import {
  binaryTokenIndexRightMost,
  binaryTokenIndexSearch,
  binaryTokenSearch,
} from "../utils/search";
import { URI } from "../utils/uri";
import { retrieveProcedureFromLabelPrefix } from "../validation/utils";
import { CompilationUnit } from "../workspace/compilation-unit";
import { getEffectiveIncludeAlt } from "../preprocessor/compiler-options/options-pli";
import { HoverResponse, tokenToRange } from "./types";
import { getFileContentPreview } from "./cache/include-cache";
import {
  stringifyDeclaration,
  stringifyTypeDescription,
} from "../typesystem/stringify";
import { BuiltinsUriSchema } from "../workspace/builtins";
import { JSDocComment } from "../documentation/jsdoc";
import { isJSDoc, parseJSDoc } from "../documentation/jsdoc";
import { tokenMatcher } from "chevrotain";
import { CstNodeKind } from "../syntax-tree/cst";

type MarkupResponse = string | null;

interface MarkupGeneratorContext {
  unit: CompilationUnit;
  token: t.Token;
}

interface MarkupGenerator {
  (context: MarkupGeneratorContext): MarkupResponse;
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
        if (item.kind === SyntaxKind.SimpleOptionsItem && item.value !== null) {
          internalOptions.push(t.SimpleOptions.mapFromEnumLiteral(item.value));
        }
      }
      if (internalOptions.length > 0) {
        optionStrings.push(`OPTIONS(${internalOptions.join(", ")})`);
      }
    } else if (
      option.kind === SyntaxKind.ProcedureOrderOption &&
      option.order !== null
    ) {
      optionStrings.push(t.ProcedureOrder.mapFromEnumLiteral(option.order));
    } else if (option.kind === SyntaxKind.ProcedureRecursiveOption) {
      optionStrings.push("RECURSIVE");
    } else if (option.kind === SyntaxKind.ReturnsOption) {
      // returns options
      const attrArr: string[] = [];
      const attrs = option.returnAttributes;
      for (const attr of attrs) {
        if (
          attr.kind === SyntaxKind.ComputationDataAttribute &&
          attr.type !== null
        ) {
          if (attr.dimensions) {
            // type w/ dimens, need to be decoded
            attrArr.push(
              t.DefaultAttribute.mapFromEnumLiteral(attr.type) +
                decodeDimensions(attr.dimensions),
            );
          } else {
            // just the type
            attrArr.push(t.DefaultAttribute.mapFromEnumLiteral(attr.type));
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
  const expr = bound.expression;
  if (expr.kind === SyntaxKind.WildcardItem) {
    return "*";
  } else if (
    expr.kind === SyntaxKind.NumberLiteral ||
    expr.kind === SyntaxKind.StringLiteral
  ) {
    return expr.value;
  } else {
    // fail to decode on non-literal exprs
    return null;
  }
}

interface IncludeItemNode {
  filePath: string | null;
  relativeFilePath: string | null;
}

/**
 * Converts an IncludeItem or InscanDirective to a string representation.
 * Ex. %INCLUDE "/path/to/file.pli"
 */
function getIncludeItemRepresentation(
  unit: CompilationUnit,
  node: IncludeItemNode,
  type: string,
): string | null {
  if (!node.filePath || !node.relativeFilePath) {
    return null;
  }
  const fileUri = URI.parse(node.filePath);
  const doc = unit.services.files.getDocument(fileUri);
  if (!doc) {
    return null;
  }
  const partialContent = getFileContentPreview(unit, node.filePath, doc);
  if (!partialContent) {
    return null;
  }

  if (fileUri.scheme === BuiltinsUriSchema) {
    // for builtins, we don't actually want to show the path
    return generateIncludeItemMarkup(partialContent);
  } else {
    return generateIncludeItemMarkup(
      type,
      node.relativeFilePath,
      partialContent,
    );
  }
}
export function generateIncludeItemMarkup(sourceText: string): string;
export function generateIncludeItemMarkup(
  type: string,
  relativePath: string,
  sourceText: string,
): string;
export function generateIncludeItemMarkup(
  sourceTextOrType: string,
  relativePath?: string,
  sourceText?: string,
): string {
  if (sourceText !== undefined && relativePath !== undefined) {
    return `${formatPliCodeBlock(`${sourceTextOrType} "${relativePath}"`)}\n\n---\n${formatPliCodeBlock(sourceText)}`;
  } else {
    return formatPliCodeBlock(sourceTextOrType);
  }
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
      return node.name
        ? (stringifyTypeDescription(
            node.name,
            unit.services.inferer.inferType(node, unit),
          ) ?? stringifyDeclaration(node, unit))
        : null;
    case SyntaxKind.LabelPrefix:
      return getLabelPrefixRepresentation(node);
    case SyntaxKind.IncludeItemFile:
    case SyntaxKind.IncludeItemMember:
      const type = computeIncludeType(unit, node);
      return getIncludeItemRepresentation(unit, node, type);
    case SyntaxKind.InscanDirective:
      return getIncludeItemRepresentation(unit, node, "%INSCAN");
    case SyntaxKind.CicsResponseStatement:
      const codeValue = node.code;
      const codeImage = node.codeToken?.image;
      if (codeValue !== null && codeImage) {
        return formatPliCodeBlock(`DFHRESP(${codeImage}) = ${codeValue}`);
      }
      return null;
    default:
      return null;
  }
}

function computeIncludeType(unit: CompilationUnit, node: SyntaxNode): string {
  let type = "%INCLUDE";
  const ppInclude = getEffectiveIncludeAlt(unit.compilerOptions);
  if (node.container?.kind === SyntaxKind.IncludeAltDirective && ppInclude) {
    type = ppInclude;
  }
  // else if (getContainer(node, SyntaxKind.SqlExecStatement)) {
  //   // Include as part of an EXEC SQL statement
  //   type = "EXEC SQL INCLUDE";
  // }
  return type;
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

  if (
    token.element.container &&
    (token.element.container.kind === SyntaxKind.MemberCall ||
      token.element.container.kind === SyntaxKind.CallStatement)
  ) {
    const outerCall = token.element.container;
    if (!outerCall) {
      return null;
    }
    let jsDocsComment = "";
    if (ref.node.kind === SyntaxKind.LabelPrefix) {
      if (ref.node.nameToken?.uri?.scheme !== BuiltinsUriSchema) {
        // JSDoc is only for builtins
        return getNodeRepresentation(unit, ref.node);
      }
      const jsDoc = getJSDocCommentBeforeLabelPrefix(
        ref.node as LabelPrefix,
        unit,
      );
      if (jsDoc) {
        jsDocsComment = jsDoc.toMarkdown();
        jsDocsComment = jsDocsComment ? `\n---\n${jsDocsComment}` : "";
      }
    }
    const type = unit.services.inferer.inferType(outerCall, unit);
    return (
      (stringifyTypeDescription(token.image, type) ??
        stringifyDeclaration(ref.node as DeclaredVariable, unit)) +
      jsDocsComment
    );
  }

  return getNodeRepresentation(unit, ref.node);
};

/**
 * Generates markup from an include item token
 * @returns Markup or null if not applicable
 */
const generateIncludeItemTokenMarkup: MarkupGenerator = ({ unit, token }) => {
  if (token.element) {
    if (isIncludeItemToken(token.kind)) {
      return getNodeRepresentation(unit, token.element);
    } else if (
      token.element.kind === SyntaxKind.ExecStatement &&
      typeof token.element.replacement === "object" &&
      token.element.replacement!.kind === SyntaxKind.IncludeDirective &&
      token.element.replacement!.items.length > 0
    ) {
      return getNodeRepresentation(unit, token.element.replacement!.items[0]);
    }
  }
  return null;
};

const generateDfhResponseMarkup: MarkupGenerator = ({ unit, token }) => {
  if (
    token.element &&
    token.element.kind === SyntaxKind.CicsResponseStatement
  ) {
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
  const tokens = unit.services.files.getTokens(uri);
  if (!tokens) {
    return null;
  }
  let token = binaryTokenSearch(tokens, offset);
  if (!token) {
    return null;
  }

  // edge case: bend preprocessor identifiers
  if (
    token.kind === CstNodeKind.ExecStatement_ExecFragment &&
    token.element &&
    token.element.kind === SyntaxKind.ExecStatement &&
    (token.element.replacement === null || // include identifiers are handled separately, so we don't want to bend them here
      typeof token.element.replacement !== "object" ||
      token.element.replacement.kind !== SyntaxKind.IncludeDirective)
  ) {
    const ppToken = token.element.preprocessorTokens.find(
      (t) => t.token.startOffset <= offset && t.token.endOffset >= offset,
    );
    if (ppToken) {
      token = ppToken.token;
    }
  }

  const generators: MarkupGenerator[] = [
    generateReferenceTokenMarkup,
    generateIncludeItemTokenMarkup,
    generateNameTokenMarkup,
    generateDfhResponseMarkup,
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

export function getJSDocCommentBeforeLabelPrefix(
  labelPrefix: LabelPrefix,
  compilationUnit: CompilationUnit,
): JSDocComment | null {
  if (!labelPrefix.nameToken) {
    return null;
  }
  const uri = labelPrefix.nameToken.uri;
  if (!uri || uri.scheme !== BuiltinsUriSchema) {
    //if it's not a builtin, we can skip the work of looking for comments entirely
    //only JSDoc on builtins is currently supported
    return null;
  }
  const tokens = compilationUnit.services.files.getTokens(uri);
  const commentTokens = compilationUnit.services.files.getComments(uri);
  if (!tokens || !commentTokens) {
    return null;
  }
  let tokenIndex = binaryTokenIndexSearch(
    tokens,
    labelPrefix.nameToken.startOffset,
  );
  const commentIndex = binaryTokenIndexRightMost(
    commentTokens,
    labelPrefix.nameToken.startOffset,
  );
  if (commentIndex > -1) {
    const commentToken = commentTokens[commentIndex];
    while (
      //skip any preprocessor directives between the comment and the label prefix
      tokenIndex > 0 &&
      tokens[tokenIndex - 1] &&
      tokens[tokenIndex - 1].image === "%"
    ) {
      tokenIndex--;
    }
    while (
      tokenIndex >= 2 &&
      tokenMatcher(tokens[tokenIndex - 1], t.Colon) &&
      tokenMatcher(tokens[tokenIndex - 2], t.ID)
    ) {
      /*
       * Edge case 1: alias declaration with comment on original, hover on alias:
       * /** comment *\/
       * PROC1:
       * PROC2: PROCEDURE; <-- hover PROC2: comment should be included
       */
      tokenIndex -= 2;
    }
    if (tokenIndex > 0) {
      /*
       * Edge case 2: two declarations, only first has comment, second gets hovered:
       * /** comment *\/
       * DCL1
       * DCL2 //<-- hover here: no comment included
       */
      const tokenBeforeLabelPrefix = tokens[tokenIndex - 1];
      if (tokenBeforeLabelPrefix.startOffset > commentToken.endOffset) {
        return null;
      }
    }
    if (isJSDoc(commentToken)) {
      return parseJSDoc(commentToken);
    }
  }
  return null;
}
