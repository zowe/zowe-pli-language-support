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
} from "../language-server/types";
import { ReferencesCache } from "../linking/resolver";
import { isValidToken } from "../linking/tokens";
import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { registerPliValidationChecks } from "./pli-validator";
import { LexingError } from "../preprocessor/pli-lexer";
import { isMainProcedure, labelPrefixPointsToPackage } from "./utils";
import { ScopeCache, ScopeCacheGroups } from "../linking/scope";
import { LinkerErrorReporter } from "../linking/error";
import {
  CompilerOptionIssue,
  compilerOptionIssueToDiagnostics,
} from "../preprocessor/compiler-options/options";
import * as AST from "../syntax-tree/ast";

/**
 * A function that accepts a diagnostic for PL/I validation
 */
export type ValidationAcceptor = (
  severity: Severity,
  message: string,
  info: DiagnosticInfo,
) => void;

export type ValidationFunction = (
  node: any,
  acceptor: ValidationAcceptor,
) => void;

export type SyntaxKindStrings = keyof typeof AST.SyntaxKind;

export type ValidationChecks = Partial<
  Record<SyntaxKindStrings, ValidationFunction[]>
>;

export interface Validator {
  getHandlers(): ValidationChecks;
}

export class ValidationBuffer {
  private diagnostics: Diagnostic[] = [];

  getAcceptor(): ValidationAcceptor {
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
  const validator = registerPliValidationChecks(unit);

  const validationBuffer = new ValidationBuffer();
  const acceptor = validationBuffer.getAcceptor();

  // iterate over all nodes and validate them
  validateSyntaxNode(unit.ast, acceptor, validator.getHandlers());

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
  acceptor: ValidationAcceptor,
  handlers: ValidationChecks,
): void {
  // get the name of enum value for node.kind
  const name = SyntaxKind[node.kind] as keyof typeof SyntaxKind;
  if (handlers[name]) {
    for (const validationFunc of handlers[name]) {
      validationFunc(node, acceptor);
    }
  }

  forEachNode(node, (childNode: SyntaxNode) => {
    validateSyntaxNode(childNode, acceptor, handlers);
  });
}

export function compilerOptionIssuesToDiagnostics(
  compilerOptionIssues: CompilerOptionIssue[] | undefined,
  uri: string,
): Diagnostic[] {
  if (!compilerOptionIssues) {
    return [];
  }
  const diagnostics: Diagnostic[] = [];
  for (const issue of compilerOptionIssues) {
    if (!isNaN(issue.range.start)) {
      diagnostics.push(compilerOptionIssueToDiagnostics(issue, uri));
    }
  }
  return diagnostics;
}

export function lexerErrorsToDiagnostics(
  lexerErrors: LexingError[],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const error of lexerErrors) {
    if (error.uri && error.range && !isNaN(error.range.start)) {
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

function linkingRedeclarationErrorsToDiagnostics(
  regularScopeCache: ScopeCache,
  reporter: LinkerErrorReporter,
) {
  const symbols = new Set(
    regularScopeCache
      .values()
      .flatMap((scope) => scope.symbolTable.symbols.values())
      .filter((symbol) => symbol.isRedeclared),
  );

  for (const symbol of symbols) {
    const nameToken = symbol.token;
    if (!nameToken) {
      continue;
    }

    /**
     * Throw different errors depending on if the declaration is a label for a procedure or a declaration statement.
     *
     * TODO @didrikmunther: A LabelPrefix without a procedure option should throw a IBM1911I error instead.
     * Currently, we don't have a way to know if a label is a statement label or a procedure label.
     */
    if (symbol.node.kind === SyntaxKind.LabelPrefix) {
      reporter.reportAlreadyDeclared(nameToken, symbol.name);
    } else {
      reporter.reportRepeatedDeclaration(nameToken, symbol.name);
    }
  }
}

export function linkingErrorsToDiagnostics(
  unit: CompilationUnit,
  references: ReferencesCache,
  scopeCaches: ScopeCacheGroups,
): Diagnostic[] {
  const validationBuffer = new ValidationBuffer();
  const reporter = new LinkerErrorReporter(
    unit,
    validationBuffer.getAcceptor(),
  );

  // @didrikmunther Only checking the regular scope for now
  linkingRedeclarationErrorsToDiagnostics(scopeCaches.regular, reporter);

  for (const reference of references.allReferences()) {
    if (reference.node === null && isValidToken(reference.token)) {
      // Question: is reference.text and token.image the same?
      reporter.reportCannotFindSymbol(reference.token, reference.text);
    }
  }

  // Warn if a label is never referenced
  for (const [node, nodeReferences] of references.allReverseReferences()) {
    if (node.kind !== SyntaxKind.LabelPrefix) {
      continue;
    }

    // If the node has no name token, we can't even create a diagnostic, skip it
    if (!node.nameToken) {
      continue;
    }

    // If the label prefix points to a package, don't warn
    if (labelPrefixPointsToPackage(node)) {
      continue;
    }

    // The main procedure is never directly referenced anyway, so we don't need to warn
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

    reporter.reportUnreferencedSymbol(node.nameToken);
  }

  return validationBuffer.getDiagnostics();
}
