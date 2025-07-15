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
  DiagnosticInfo,
  Range,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import { Token } from "../parser/tokens";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { PLICodes } from "../validation/messages";
import { PliValidationAcceptor } from "../validation/validator";
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

function getLocation(token: Token) {
  const uri = tokenToUri(token);
  const range = tokenToRange(token);

  if (!uri) {
    return null;
  }

  return { uri, range };
}

function withLocation(token: Token, then: (location: DiagnosticInfo) => void) {
  const location = getLocation(token);
  if (!location) {
    return;
  }

  then(location);
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
    protected readonly accept: PliValidationAcceptor,
  ) {}

  /**
   * E IBM1363I
   */
  reportLevelError(levelToken: Token) {
    withLocation(levelToken, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1363I.message, {
        code: PLICodes.Error.IBM1363I.fullCode,
        range,
        uri,
      }),
    );
  }

  /**
   * E IBM1308I
   */
  reportRedeclaration(token: Token) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1308I.message(token.image), {
        code: PLICodes.Error.IBM1308I.fullCode,
        range,
        uri,
      }),
    );
  }

  /**
   * S IBM1916I
   */
  reportAlreadyDeclared(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.S, PLICodes.Severe.IBM1916I.message(name), {
        uri,
        range,
        code: PLICodes.Severe.IBM1916I.fullCode,
      }),
    );
  }

  /**
   * E IBM1306I
   */
  reportRepeatedDeclaration(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1306I.message(name), {
        uri,
        range,
        code: PLICodes.Error.IBM1306I.fullCode,
      }),
    );
  }

  /**
   * Synthetic error for when we cannot find a symbol.
   */
  reportCannotFindSymbol(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, `Unknown identifier '${name}'`, {
        uri,
        range,
      }),
    );
  }

  /**
   * W IBM1213I
   */
  reportUnreferencedSymbol(token: Token) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, PLICodes.Warning.IBM1213I.message(token.image), {
        uri,
        range,
        code: PLICodes.Warning.IBM1213I.fullCode,
      }),
    );
  }

  /**
   * S IBM1881I
   */
  reportAmbiguousReference(reference: Reference, name: string) {
    const report = ({ range, uri }: DiagnosticInfo) =>
      this.accept(Severity.S, PLICodes.Severe.IBM1881I.message(name), {
        range,
        uri,
        code: PLICodes.Severe.IBM1881I.fullCode,
      });

    const range = getQualifiedReferenceRange(reference.owner);
    const uri = tokenToUri(reference.token);

    if (range && uri !== undefined) {
      report({ range, uri });
    } else {
      withLocation(reference.token, report);
    }
  }

  /**
   * E IBM1373I
   *
   * Only reports the first implicit declaration per node.
   */
  reportImplicitDeclaration(node: QualifiedSyntaxNode) {
    // This should only emit a warning during the 'NOLAXDCL' compiler flag.
    if (this.unit.compilerOptions.rules?.laxdef) {
      return;
    }

    // We have already reported this implicit declaration.
    if (this.implicitlyDeclaredNodes.has(node)) {
      return;
    }

    this.implicitlyDeclaredNodes.add(node);

    withLocation(node.token, ({ range, uri }) =>
      this.accept(Severity.W, PLICodes.Error.IBM1373I.message(node.name), {
        uri,
        range,
        code: PLICodes.Error.IBM1373I.fullCode,
      }),
    );
  }

  /**
   * W IBM1085I
   */
  reportPotentialUnsetVariable(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, PLICodes.Warning.IBM1085I.message(name), {
        uri,
        range,
        code: PLICodes.Warning.IBM1085I.fullCode,
      }),
    );
  }
}
