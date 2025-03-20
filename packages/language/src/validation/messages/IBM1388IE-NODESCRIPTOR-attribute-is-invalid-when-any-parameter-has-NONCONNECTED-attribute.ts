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

// TODO: Reimplement once the validation infrastructure is in place

// import { ValidationAcceptor } from "langium";
// import {
//   isComputationDataAttribute,
//   isDeclaredVariable,
//   isDeclareStatement,
//   isSimpleOptionsItem,
//   isStatement,
//   ProcedureStatement,
//   SimpleOptionsItem,
// } from "../../generated/ast";
// import { compareIdentifiers, normalizeIdentifier } from "../utils";

// export function IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute(
//   procedureStatement: ProcedureStatement,
//   accept: ValidationAcceptor,
// ): void {
//   const items = procedureStatement.options.flatMap((o) => o.items);
//   const item = items.find(
//     (i) => isSimpleOptionsItem(i) && i.value.toUpperCase() === "NODESCRIPTOR",
//   ) as SimpleOptionsItem | undefined;
//   if (item) {
//     const parameterNames = new Set(
//       procedureStatement.parameters.map((p) => normalizeIdentifier(p.id)),
//     );
//     const nonConnectedParameters = procedureStatement.statements
//       .filter(isStatement)
//       .map((s) => s.value)
//       .filter(isDeclareStatement)
//       .flatMap((d) => d.items)
//       .filter(
//         (i) =>
//           isDeclaredVariable(i.element) &&
//           parameterNames.has(normalizeIdentifier(i.element.name)),
//       )
//       .filter((i) =>
//         i.attributes.some(
//           (a) =>
//             isComputationDataAttribute(a) &&
//             compareIdentifiers(a.type, "NONCONNECTED"),
//         ),
//       );
//     if (nonConnectedParameters.length > 0) {
//       accept(
//         "error",
//         "The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",
//         {
//           code: "IBM1388IE",
//           node: item,
//           property: "value",
//         },
//       );
//     }
//   }
// }
