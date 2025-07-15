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

// import { getSyntaxNodeRange, Severity } from "../../language-server/types";
// import { DeclaredItem, MemberCall, SyntaxKind } from "../../syntax-tree/ast";
// import { PliValidationAcceptor } from "../validator";

// TODO: Reimplement once the validation infrastructure is in place

// import { AstUtils, ValidationAcceptor } from "langium";
// import {
//   isDeclaredVariable,
//   isEntryAttribute,
//   MemberCall,
// } from "../../generated/ast";

/**
 * This validation addresses functions, not procedures.
 * TODO check if also procedures are affected
 * @see https://www.ibm.com/docs/en/epfz/6.1?topic=codes-compiler-severe-messages-1500-2399#ibm1747i__msgId__1
 */
// TODO @montymxb Mar. 27th, 2025: Needs to have a way to readily access the containing 'document' (SourceFile) to compare the offsets
// export function IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned(
//     call: MemberCall,
//     accept: PliValidationAcceptor,
// ): void {
//     // member call points to variable declaration...
//     // if (!isDeclaredVariable(call.element.ref.ref)) {
//     if (call.element?.ref?.node?.kind !== SyntaxKind.DeclaredVariable) {
//         return;
//     }
//     // ...which actually is a function declaration...
//     // const declaration = call.element.ref.ref.$container;
//     const declaration = call.element.ref.node.container as DeclaredItem;
//     // if (!declaration || !declaration.attributes.some((a) => isEntryAttribute(a) && a.returns)) {
//     if (!declaration || !declaration.attributes.some((a) => a.kind === SyntaxKind.EntryAttribute && a.returns)) {
//         return;
//     }
//     //... where both function call and function declaration are in the same file...
//     const callDocument = AstUtils.getDocument(call);
//     const declarationDocument = AstUtils.getDocument(declaration);
//     if (callDocument !== declarationDocument) {
//         return;
//     }
//     //...and the declaration happens after the call
//     const callOffset = call.$cstNode!.offset;
//     const declarationOffset = declaration.$cstNode!.offset;
//     if (callOffset > declarationOffset) {
//         return;
//     }
//     //throw error
//     accept(
//         Severity.E,
//         "Function cannot be used before the function's descriptor list has been scanned.",
//         {
//             code: "IBM1747IS",
//             range: getSyntaxNodeRange(call)!,
//             uri: "", // TODO: Add URI
//             // node: call,
//             // property: "element",
//         },
//     );
// }
