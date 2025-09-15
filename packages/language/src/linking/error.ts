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
  diagnostic,
  diagnosticFromCode,
  Range,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import { Token } from "../parser/tokens";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { PLICodes } from "../validation/messages";
import { ValidationAcceptor } from "../validation/validator";
import { CompilationUnit } from "../workspace/compilation-unit";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";

function mergeRanges(...ranges: Range[]): Range {
  return {
    start: Math.min(...ranges.map((r) => r.start).filter((n) => !isNaN(n))),
    end: Math.max(...ranges.map((r) => r.end).filter((n) => !isNaN(n))),
  };
}

/**
 * Given that a node is a reference item, this function will return the range of the qualified reference.
 *
 * For example, given the following node:
 * ```
 * PUT(A.B.C);
 * ```
 *
 * The range of the full qualified reference will be the range of the entire `A.B.C` sequence.
 *
 * @param node The node to get the range of.
 * @returns The range of the qualified reference.
 */
function getQualifiedReferenceRange(
  node: SyntaxNode | null,
): Range | undefined {
  if (!node) {
    return undefined;
  }

  switch (node.kind) {
    case SyntaxKind.ReferenceItem:
      return getQualifiedReferenceRange(node.container);
    case SyntaxKind.MemberCall:
      const token = node.element?.ref?.token;
      if (!token) {
        return undefined;
      }
      const range = tokenToRange(token);
      const previousRange = getQualifiedReferenceRange(node.previous);
      if (!previousRange) {
        return range;
      }
      return mergeRanges(range, previousRange);
    default:
      return undefined;
  }
}

export class LinkerErrorReporter {
  /**
   * Set of nodes that have been implicitly declared.
   * Used to avoid reporting the same implicit declaration multiple times.
   */
  private readonly implicitlyDeclaredNodes: Set<QualifiedSyntaxNode> =
    new Set();

  constructor(
    private readonly unit: CompilationUnit,
    protected readonly accept: ValidationAcceptor,
  ) {}

  /**
   * E IBM1363I
   */
  reportLevelError(levelToken: Token) {
    this.accept(diagnosticFromCode(PLICodes.Error.IBM1363I, levelToken));
  }

  /**
   * E IBM1308I
   */
  reportRedeclaration(token: Token) {
    this.accept(
      diagnosticFromCode(PLICodes.Error.IBM1308I, token, token.image),
    );
  }

  /**
   * S IBM1916I
   */
  reportAlreadyDeclared(token: Token, name: string) {
    this.accept(diagnosticFromCode(PLICodes.Severe.IBM1916I, token, name));
  }

  /**
   * E IBM1306I
   */
  reportRepeatedDeclaration(token: Token, name: string) {
    this.accept(diagnosticFromCode(PLICodes.Error.IBM1306I, token, name));
  }

  /**
   * Synthetic error for when we cannot find a symbol.
   */
  reportCannotFindSymbol(token: Token, name: string) {
    this.accept(diagnostic(Severity.E, `Unknown identifier '${name}'`, token));
  }

  /**
   * W IBM1213I
   */
  reportUnreferencedSymbol(token: Token) {
    this.accept(
      diagnosticFromCode(PLICodes.Warning.IBM1213I, token, token.image),
    );
  }

  /**
   * S IBM1881I
   */
  reportAmbiguousReference(reference: Reference, name: string) {
    const range =
      getQualifiedReferenceRange(reference.owner) ??
      tokenToRange(reference.token);
    const uri = tokenToUri(reference.token);

    this.accept({
      message: PLICodes.Severe.IBM1881I.message(name),
      severity: Severity.S,
      range,
      uri,
      code: PLICodes.Severe.IBM1881I.fullCode,
    });
  }

  /**
   * E IBM1373I
   *
   * Only reports the first implicit declaration per node.
   */
  reportImplicitDeclaration(node: QualifiedSyntaxNode) {
    // This should only emit a warning during the 'NOLAXDCL' compiler flag.
    if (this.unit.compilerOptions.rules?.laxDef) {
      return;
    }

    // We have already reported this implicit declaration.
    if (this.implicitlyDeclaredNodes.has(node)) {
      return;
    }

    this.implicitlyDeclaredNodes.add(node);
    this.accept(
      diagnosticFromCode(PLICodes.Error.IBM1373I, node.token, node.name),
    );
  }

  /**
   * W IBM1085I
   */
  reportPotentialUnsetVariable(token: Token, name: string) {
    this.accept(diagnosticFromCode(PLICodes.Warning.IBM1085I, token, name));
  }
}
