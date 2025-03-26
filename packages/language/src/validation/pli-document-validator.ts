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

// import {
//   AstNode,
//   DefaultDocumentValidator,
//   DiagnosticInfo,
//   DocumentValidator,
//   LangiumDocument,
//   LinkingErrorData,
//   ValidationOptions,
// } from "langium";
// import { Diagnostic } from "vscode-languageserver-types";

// export class PliDocumentValidator extends DefaultDocumentValidator {
//   protected override processLinkingErrors(
//     document: LangiumDocument,
//     diagnostics: Diagnostic[],
//     _options: ValidationOptions,
//   ): void {
//     for (const reference of document.references) {
//       const linkingError = reference.error;
//       if (linkingError) {
//         const info: DiagnosticInfo<AstNode, string> = {
//           node: linkingError.container,
//           property: linkingError.property,
//           index: linkingError.index,
//           data: {
//             code: DocumentValidator.LinkingError,
//             containerType: linkingError.container.$type,
//             property: linkingError.property,
//             refText: linkingError.reference.$refText,
//           } satisfies LinkingErrorData,
//         };
//         diagnostics.push(
//           this.toDiagnostic("warning", linkingError.message, info),
//         );
//       }
//     }
//   }
// }
