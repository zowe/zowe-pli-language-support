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

import { getSyntaxNodeRange, Severity } from "../../language-server/types";
import {
  DeclareStatement,
  ProcedureStatement,
  SimpleOptionsItem,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { compareIdentifiers, normalizeIdentifier } from "../utils";
import { PliValidationAcceptor } from "../validator";

export function IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute(
  procedureStatement: ProcedureStatement,
  accept: PliValidationAcceptor,
): void {
  const items = procedureStatement.options.flatMap((o) => o.items);
  const item = items.find(
    (i) =>
      i.kind === SyntaxKind.SimpleOptionsItem &&
      i.value &&
      i.value.toUpperCase() === "NODESCRIPTOR",
  ) as SimpleOptionsItem | undefined;
  if (item) {
    const parameterNames = new Set(
      procedureStatement.parameters.map((p) =>
        p.id ? normalizeIdentifier(p.id) : p.id,
      ),
    );

    const declareStmts: DeclareStatement[] = procedureStatement.statements
      .filter((s) => s.kind === SyntaxKind.Statement)
      .map((s) => s.value)
      .filter(
        (s) => s !== null && s.kind === SyntaxKind.DeclareStatement,
      ) as DeclareStatement[];

    const nonConnectedParameters = declareStmts
      .flatMap((d) => d.items)
      .filter(
        (i) =>
          i.element &&
          i.element !== "*" &&
          i.element.kind === SyntaxKind.DeclaredVariable &&
          parameterNames.has(normalizeIdentifier(i.element.name!)),
      )
      .filter((i) =>
        i.attributes.some(
          (a) =>
            a.kind === SyntaxKind.ComputationDataAttribute &&
            compareIdentifiers(a.type!, "NONCONNECTED"),
        ),
      );
    if (nonConnectedParameters.length > 0) {
      accept(
        Severity.E,
        "The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",
        {
          code: "IBM1388IE",
          range: getSyntaxNodeRange(item)!,
          uri: "", // TODO: Add URI
          //   node: item,
          //   property: "value",
        },
      );
    }
  }
}
