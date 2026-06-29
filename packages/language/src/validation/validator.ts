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
import { Diagnostic, tokenToUri } from "../language-server/types";
import { ReferencesCache } from "../linking/resolver";
import { isValidToken } from "../linking/tokens";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { registerPliValidationChecks } from "./pli-validator";
import { ScopeCache, ScopeCacheGroups } from "../linking/scope";
import { LinkerErrorReporter } from "../linking/error";
import {
  PropagateIncludeItemErrors,
  registerPreprocessorValidationChecks,
} from "./pp-validator";
import { DiagnosticCategory } from "./diagnostics-store";

/**
 * A function that accepts a diagnostic for PL/I validation
 */
export type ValidationAcceptor = (diagnostic: Diagnostic) => void;

export type ValidationFunction<T extends SyntaxNode> = (
  node: T,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) => void;

export type ValidationChecks = Partial<{
  [K in keyof typeof SyntaxKind as (typeof SyntaxKind)[K] extends SyntaxNode["kind"]
    ? K
    : never]: ValidationFunction<
    Extract<SyntaxNode, { kind: (typeof SyntaxKind)[K] }>
  >[];
}>;

const ppValidations = registerPreprocessorValidationChecks();

export function generatePreprocessorValidationDiagnostics(
  unit: CompilationUnit,
): void {
  const acceptor = unit.diagnostics.getAcceptor(DiagnosticCategory.Validation);
  if (unit.compilerOptions.incAfter?.token) {
    const item = unit.compilerOptions.incAfter.token.element;
    if (item && item.kind === SyntaxKind.IncludeItemFile) {
      PropagateIncludeItemErrors(item, acceptor, unit);
    }
  }
  validateSyntaxNode(unit, unit.preprocessorAst, acceptor, ppValidations);
}

const pliValidations = registerPliValidationChecks();

/**
 * Generates validation diagnostics (semantic checks) from the given AST node.
 */
export function generatePliValidationDiagnostics(unit: CompilationUnit): void {
  const acceptor = unit.diagnostics.getAcceptor(DiagnosticCategory.Validation);
  validateSyntaxNode(unit, unit.ast, acceptor, pliValidations);
}

/**
 * Validates a given syntax node and its children.
 * @param node Node to validate
 * @param acceptor Acceptor for logging diagnostics
 * @param handlers Registered handlers for validating specific node types
 */
function validateSyntaxNode(
  compilationUnit: CompilationUnit,
  node: SyntaxNode,
  acceptor: ValidationAcceptor,
  handlers: ValidationChecks,
): void {
  // get the name of enum value for node.kind
  const name = SyntaxKind[node.kind] as keyof typeof SyntaxKind;
  const kindHandlers = handlers[name];
  if (kindHandlers) {
    for (const validationFunc of kindHandlers) {
      validationFunc(node as any, acceptor, compilationUnit);
    }
  }

  forEachNode(node, (childNode: SyntaxNode) => {
    validateSyntaxNode(compilationUnit, childNode, acceptor, handlers);
  });
}

function linkingRedeclarationErrorsToDiagnostics(
  regularScopeCache: ScopeCache,
  reporter: LinkerErrorReporter,
) {
  for (const scope of regularScopeCache.values()) {
    for (const symbol of scope.symbolTable.symbols.values()) {
      const nameToken = symbol.token;
      if (!symbol.isRedeclared || !nameToken) {
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
}

export function linkingErrorsToDiagnostics(
  unit: CompilationUnit,
  references: ReferencesCache,
  scopeCaches: ScopeCacheGroups,
): void {
  const reporter = new LinkerErrorReporter(
    unit,
    unit.diagnostics.getAcceptor(DiagnosticCategory.Linking),
  );

  // @didrikmunther Only checking the regular scope for now
  linkingRedeclarationErrorsToDiagnostics(scopeCaches.regular, reporter);

  for (const reference of references.allReferences()) {
    if (reference.node === null && isValidToken(reference.token)) {
      // If a specific linking diagnostic can be generated for this reference, generate it and return,
      // otherwise report a generic "cannot find symbol" error
      if (generateLinkingDiagnostic(reporter, unit, reference)) {
        reporter.reportCannotFindSymbol(reference.token, reference.text);
      }
    }
  }
}

function generateLinkingDiagnostic(
  reporter: LinkerErrorReporter,
  unit: CompilationUnit,
  reference: Reference,
): boolean {
  const owner = reference.owner;
  const uri = tokenToUri(reference.token);
  if (!uri) {
    return false;
  }
  // 1. check if the reference is part of a member call
  // highlight the entire member call if it is, otherwise just the reference token
  if (
    owner.kind === SyntaxKind.ReferenceItem &&
    owner.container?.kind === SyntaxKind.MemberCall
  ) {
    const isTopMost = owner.container.container?.kind !== SyntaxKind.MemberCall;
    if (!isTopMost) {
      // Do not report the error on this reference, it will be reported on the top-most member call
      return false;
    }
    let currentNode = owner.container;
    if (currentNode.previous === null) {
      // Top most + no previous means this is just a simple reference, report a generic error
      return true;
    }
    const names: string[] = [reference.text];
    // Traverse through the previous items to get the full chain
    while (currentNode.previous !== null) {
      const name = currentNode.previous.element?.ref?.text;
      if (name) {
        names.push(name);
      } else {
        // Likely a parser error, do not report the linking error
        return false;
      }
      currentNode = currentNode.previous;
    }
    const start = currentNode.element?.ref?.token.startOffset;
    const end = reference.token.endOffset + 1;
    if (start !== undefined) {
      // Report the name and return
      const fqn = names.reverse().join(".");
      reporter.reportFqnReferenceNotFound(uri, fqn, start, end);
    }
    return false;
  }
  // Report the error
  return true;
}
