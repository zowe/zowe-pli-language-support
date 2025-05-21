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

import { IRecognitionException, MismatchedTokenException } from "chevrotain";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  Diagnostic,
  DiagnosticInfo,
  Range,
  Severity,
  tokenToRange,
} from "../language-server/types";
import { ReferencesCache } from "../linking/resolver";
import { isValidToken } from "../linking/tokens";
import { TokenPayload } from "../parser/abstract-parser";
import { LabelPrefix, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import {
  PliValidationChecks,
  PliValidationFunction,
  registerValidationChecks,
} from "./pli-validator";
import * as PLICodes from "../validation/messages/pli-codes";
import { LexingError } from "../preprocessor/pli-lexer";

/**
 * A function that accepts a diagnostic for PL/I validation
 */
export type PliValidationAcceptor = (
  severity: Severity,
  message: string,
  info: DiagnosticInfo,
) => void;

export class PliValidationBuffer {
  private diagnostics: Diagnostic[] = [];

  getAcceptor(): PliValidationAcceptor {
    return (severity: Severity, message: string, d: DiagnosticInfo) => {
      this.diagnostics.push({
        severity,
        message,
        ...d,
      });
    };
  }

  getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }
}

/**
 * Generates validation diagnostics (semantic checks) from the given AST node.
 */
export function generateValidationDiagnostics(unit: CompilationUnit): void {
  // TODO @montymxb Mar. 27th, 2025: Checks are generated on each invocation, not ideal, needs a rework still
  const handlers = registerValidationChecks();

  const validationBuffer = new PliValidationBuffer();
  const acceptor = validationBuffer.getAcceptor();

  // iterate over all nodes and validate them
  validateSyntaxNode(unit.ast, acceptor, handlers);

  unit.diagnostics.validation = validationBuffer.getDiagnostics();
}

/**
 * Validates a given syntax node and its children.
 * @param node Node to validate
 * @param acceptor Acceptor for logging diagnostics
 * @param handlers Registered handlers for validating specific node types
 */
// function validateSyntaxNode(node: SyntaxNode, acceptor: PliValidationAcceptor, handlers: Map<SyntaxKind, AstNodeValidator>): void {
function validateSyntaxNode(
  node: SyntaxNode,
  acceptor: PliValidationAcceptor,
  handlers: PliValidationChecks,
): void {
  // get the name of enum value for node.kind
  const name = SyntaxKind[node.kind] as keyof typeof SyntaxKind;
  if (handlers[name]) {
    let fnOrArray: PliValidationFunction | PliValidationFunction[] =
      handlers[name] ?? [];
    if (!(fnOrArray instanceof Array)) {
      fnOrArray = [fnOrArray];
    }

    for (const validationFunc of fnOrArray) {
      validationFunc(node, acceptor);
    }
  }

  forEachNode(node, (childNode: SyntaxNode) => {
    validateSyntaxNode(childNode, acceptor, handlers);
  });
}

export function lexerErrorsToDiagnostics(
  lexerErrors: LexingError[],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const error of lexerErrors) {
    if (!isNaN(error.range.start)) {
      diagnostics.push({
        uri: error.uri.toString(),
        severity: Severity.E,
        range: error.range,
        message: error.message,
        source: "lexer",
      });
    }
  }
  return diagnostics;
}

export function parserErrorsToDiagnostics(
  parserErrors: IRecognitionException[],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const error of parserErrors) {
    let range: Range | undefined = undefined;
    let uri: string | undefined = undefined;
    if (isNaN(error.token.startOffset)) {
      if ("previousToken" in error) {
        const token = (error as MismatchedTokenException).previousToken;
        if (!isNaN(token.startOffset)) {
          range = { start: token.startOffset, end: token.startOffset };
          uri = token.payload?.uri?.toString();
        } else {
          // No valid prev token. Might be empty document or containing only hidden tokens.
          // Point to document start
          range = { start: 0, end: 0 };
        }
      }
    } else {
      range = {
        start: error.token.startOffset,
        end: error.token.startOffset,
      };
      uri = error.token.payload?.uri?.toString();
    }
    if (range && uri) {
      const diagnostic: Diagnostic = {
        uri,
        severity: Severity.E,
        range,
        message: error.message,
        source: "parser",
      };
      diagnostics.push(diagnostic);
    }
  }
  return diagnostics;
}

/**
 * Checks if the given label prefix references a main procedure.
 * @param node Label prefix node to check
 * @returns True if the node is a main procedure, false otherwise
 */
function isMainProcedure(node: LabelPrefix): boolean {
  const statement = node.container;
  if (statement?.kind !== SyntaxKind.Statement) {
    return false;
  }

  const procedureStatement = statement.value;
  if (procedureStatement?.kind !== SyntaxKind.ProcedureStatement) {
    return false;
  }

  // There is only one main procedure per program (@didrikmunther assumption),
  // so we can just check for the presence of the main option
  return procedureStatement.options
    .filter((option) => option.kind === SyntaxKind.Options)
    .flatMap((option) => option.items)
    .filter((item) => item.kind === SyntaxKind.SimpleOptionsItem)
    .some((item) => item.value?.toLowerCase() === "main");
}

export function linkingErrorsToDiagnostics(
  references: ReferencesCache,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  for (const reference of references.allReferences()) {
    const payload = reference.token.payload as TokenPayload;

    if (
      reference.node === null &&
      isValidToken(reference.token) &&
      payload.uri
    ) {
      diagnostics.push({
        uri: payload.uri.toString(),
        severity: Severity.W,
        range: {
          start: reference.token.startOffset,
          end: reference.token.endOffset! + 1,
        },
        message: `Cannot find symbol '${reference.text}'`,
        source: "linking",
      });
    }
  }

  for (const [node, nodeReferences] of references.allReverseReferences()) {
    // Warn if a label is never referenced
    if (node.kind === SyntaxKind.LabelPrefix) {
      // If the node has no name token, we can't even create a diagnostic, skip it
      if (!node.nameToken) {
        continue;
      }

      // The main procedure is never directly referenced anyway, so we can skip it
      if (isMainProcedure(node)) {
        continue;
      }

      // Ignore all `END` nodes, since a procedure will always have one `END` node referencing itself
      const actualReferences = nodeReferences.filter(
        (reference) =>
          reference.owner.container?.kind !== SyntaxKind.EndStatement,
      );

      // The label is referenced, so we don't generate a warning
      if (actualReferences.length > 0) {
        continue;
      }

      const payload: TokenPayload = node.nameToken.payload;

      diagnostics.push({
        severity: Severity.W,
        message: PLICodes.Warning.IBM1213I.message(node.name!),
        code: PLICodes.Warning.IBM1213I.fullCode,
        uri: payload.uri?.toString() ?? "",
        range: tokenToRange(node.nameToken),
      });
    }
  }

  return diagnostics;
}
