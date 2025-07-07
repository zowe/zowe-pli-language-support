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

import { LabelPrefix, SyntaxKind } from "../syntax-tree/ast";

export function normalizeIdentifier<T extends string>(id: T): Uppercase<T> {
  return id.toUpperCase() as Uppercase<T>;
}

export function compareIdentifiers<T extends string>(lhs: T, rhs: T) {
  return normalizeIdentifier(lhs) === normalizeIdentifier(rhs);
}

/**
 * Checks if the given label prefix references a main procedure.
 * @param node Label prefix node to check
 * @returns True if the node is a main procedure, false otherwise
 */
export function isMainProcedure(node: LabelPrefix): boolean {
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

/**
 * The label prefix points to a package.
 *
 * @example
 * ```pli
 * RGT005: PACKAGE EXPORTS(RGT005);
 * ```
 */
export function labelPrefixPointsToPackage(labelPrefix: LabelPrefix) {
  return (
    labelPrefix.container?.kind === SyntaxKind.Statement &&
    labelPrefix.container.value?.kind === SyntaxKind.Package
  );
}
