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

import {
  ILexingError,
  IRecognitionException,
  MismatchedTokenException,
} from "chevrotain";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  Diagnostic,
  DiagnosticInfo,
  Range,
  Severity,
} from "../language-server/types";
import { ReferencesCache } from "../linking/resolver";
import { isValidToken } from "../linking/tokens";
import { TokenPayload } from "../parser/abstract-parser";
import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import {
  PliValidationChecks,
  PliValidationFunction,
  registerValidationChecks,
} from "./pli-validator";

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
  lexerErrors: ILexingError[],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const error of lexerErrors) {
    if (error.line && error.column) {
      diagnostics.push({
        uri: "",
        severity: Severity.E,
        range: {
          start: error.offset,
          end: error.offset + error.length,
        },
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
      const diagnostic: Diagnostic = {
        uri: payload.uri.toString(),
        severity: Severity.W,
        range: {
          start: reference.token.startOffset,
          end: reference.token.endOffset! + 1,
        },
        message: `Cannot find symbol '${reference.text}'`,
        source: "linking",
      };
      diagnostics.push(diagnostic);
    }
  }
  return diagnostics;
}
