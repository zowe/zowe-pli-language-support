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
  CallStatement,
  DeclarationAttribute,
  DeclaredVariable,
  DefaultAttribute,
  LabelPrefix,
  ProcedureStatement,
  SimpleOptions,
  SyntaxKind,
} from "../syntax-tree/ast";

export function normalizeIdentifier<T extends string>(id: T): Uppercase<T> {
  return id.toUpperCase() as Uppercase<T>;
}

export function compareIdentifiers<T extends string>(lhs: T, rhs: T) {
  return normalizeIdentifier(lhs) === normalizeIdentifier(rhs);
}

export function resolveProcedureFromCall(
  node: CallStatement,
): ProcedureStatement | null {
  const target = node.call?.element?.element?.ref?.node;
  if (!target) {
    return null;
  }
  if (!target || target.kind !== SyntaxKind.LabelPrefix) {
    return null;
  }
  return retrieveProcedureFromLabelPrefix(target);
}

/**
 * Helper to attempt to retrieve a procedure statement from a label prefix.
 */
export function retrieveProcedureFromLabelPrefix(
  labelPrefix: LabelPrefix,
): ProcedureStatement | null {
  const statement = labelPrefix.container;
  if (statement?.kind !== SyntaxKind.Statement) {
    return null;
  }

  const procedureStatement = statement.value;
  if (procedureStatement?.kind !== SyntaxKind.ProcedureStatement) {
    return null;
  }

  return procedureStatement;
}

/**
 * Checks if the given label prefix references a main procedure.
 * @param node Label prefix node to check
 * @returns True if the node is a main procedure, false otherwise
 */
export function isMainProcedure(node: LabelPrefix): boolean {
  const procedureStatement = retrieveProcedureFromLabelPrefix(node);
  if (!procedureStatement) {
    return false;
  }

  // There is only one main procedure per program (@didrikmunther assumption),
  // so we can just check for the presence of the main option
  return procedureStatement.options
    .filter((option) => option.kind === SyntaxKind.Options)
    .flatMap((option) => option.items)
    .filter((item) => item.kind === SyntaxKind.SimpleOptionsItem)
    .some((item) => item.value === SimpleOptions.MAIN);
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

export function isBuiltinDeclaration(variable: DeclaredVariable): boolean {
  const item = variable.container;
  if (!item || item.kind !== SyntaxKind.DeclaredItem) {
    return false;
  }
  return item.attributes.some(
    (attr: DeclarationAttribute) =>
      attr.kind === SyntaxKind.ComputationDataAttribute &&
      attr.type === DefaultAttribute.BUILTIN,
  );
}

export function isEntryDeclaration(variable: DeclaredVariable): boolean {
  const item = variable.container;
  if (!item || item.kind !== SyntaxKind.DeclaredItem) {
    return false;
  }
  return item.attributes.some(
    (attr: DeclarationAttribute) => attr.kind === SyntaxKind.EntryAttribute,
  );
}
