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

// import { ValidationAcceptor } from "langium";
// import { Exports } from "../../generated/ast";

// export function IBM1324IE_name_occurs_more_than_once_within_exports_clause(
//   exports: Exports,
//   accept: ValidationAcceptor,
// ): void {
//   const set = new Set<string>();
//   exports.procedures.forEach((procedure, index) => {
//     if (!set.has(procedure)) {
//       set.add(procedure);
//     } else {
//       accept(
//         "error",
//         `The name '${procedure}' occurs more than once in the EXPORTS clause.`,
//         {
//           code: "IBM1324IE",
//           node: exports,
//           property: "procedures",
//           index,
//         },
//       );
//     }
//   });
// }
