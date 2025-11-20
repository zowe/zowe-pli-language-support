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

import * as AST from "../syntax-tree/ast";
import { IBM1059I_select_without_otherwise } from "./compiler/IBM1059I-select-without-otherwise";
import { IBM1219I_leave_exits_noniterative_do } from "./compiler/IBM1219I-leave-exits-noniterative-do";
import { IBM1324IE_name_occurs_more_than_once_within_exports_clause } from "./compiler/IBM1324IE-name-occurs-more-than-once-within-exports-clause.js";
import { IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute } from "./compiler/IBM1388IE-NODESCRIPTOR-attribute-is-invalid-when-any-parameter-has-NONCONNECTED-attribute.js";
import { IBM2615I_do_loops_execute_once } from "./compiler/IBM2615I-do-loops-execute-once";
import { ValidationAcceptor, ValidationChecks } from "./validator";
import { IBM2412I_IBM2410I_IBM2409I_handle_return_stmt_and_returns_att } from "./compiler/IBM2412I-IBM2410I-IBM2409I-handle-return-stmt-and-returns-att";
import { typeCheckDeclareStatement } from "./type-check-validator";
import { checkImplicitBuiltins } from "./language-server/implicit-builtins";
import { IBM1376IE_attributes_in_declaration_lists } from "./compiler/IBM1376IE-attributes-in-declaration-lists";
import { IBM3323I_IBM3324I_check_argument_count } from "./compiler/IBM3323I-IBM3324I-check-argument-count";

/**
 * A function that accepts a diagnostic for PL/I validation
 */

/**
 * Register custom validation checks.
 */
export function registerPliValidationChecks(): ValidationChecks {
  return {
    Exports: [IBM1324IE_name_occurs_more_than_once_within_exports_clause],
    // TODO @montymxb Mar. 27th, 2025: Needs to have a way to readily access the containing 'document' (SourceFile) to compare the offsets (see def)
    // MemberCall: [IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned],
    ProcedureStatement: [
      IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute,
      IBM2412I_IBM2410I_IBM2409I_handle_return_stmt_and_returns_att,
    ],
    CallStatement: [IBM3323I_IBM3324I_check_argument_count],
    DeclareStatement: [
      IBM1376IE_attributes_in_declaration_lists,
      typeCheckDeclareStatement,
    ],
    ReferenceItem: [checkImplicitBuiltins],
    DoStatement: [IBM2615I_do_loops_execute_once],
    LeaveStatement: [IBM1219I_leave_exits_noniterative_do],
    SelectStatement: [IBM1059I_select_without_otherwise],
    // TODO @wagner-laranjeiras -> When adding ReturnStatement to this list, make sure to include comment about IBM2412/10/09I.
  };
}

// TODO: Refactor validation methods of this class into their own files and add tests
/**
 * Implementation of custom validations.
 */
export class PliValidator {
  /**
   * Verify programs contain at least one parsed statement
   */
  checkPliProgram(node: AST.Program, acceptor: ValidationAcceptor): void {
    if (node.statements.length === 0) {
      // TODO: Reimplement this validation and add tests
      // acceptor(Severity.S, PLICodes.Severe.IBM1917I.message, {
      //   code: PLICodes.Severe.IBM1917I.fullCode,
      //   range: getSyntaxNodeRange(node)!,
      //   uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
      // });
    }
  }

  /**
   * Checks return options for mutually exclusive attributes
   */
  checkReturnsOption(
    node: AST.ReturnsOption,
    acceptor: ValidationAcceptor,
  ): void {
    const attrSet = new Set<AST.DefaultAttribute>();
    for (const attr of node.returnAttributes) {
      if (attr.kind === AST.SyntaxKind.ComputationDataAttribute) {
        const typ = attr.type!;
        attrSet.add(typ); // dupes are ok

        // look for a generally negated version of this attribute (there are several)
        if (attrSet.has(`UN${typ}`)) {
          // TODO: Reimplement this validation and add tests
          // acceptor(
          //   Severity.E,
          //   PLICodes.Error.IBM2462I.message(typ, `UN${typ}`),
          //   {
          //     code: PLICodes.Error.IBM2462I.fullCode,
          //     range: getSyntaxNodeRange(node)!,
          //     uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
          //     // property: "returnAttributes",
          //     // node
          //   },
          // );
        }

        // look for a non-negated version of this type
        if (typ.startsWith("UN") && attrSet.has(typ.slice(2))) {
          // TODO: Reimplement this validation and add tests
          // acceptor(
          //   Severity.E,
          //   PLICodes.Error.IBM2462I.message(typ, typ.slice(2)),
          //   {
          //     code: PLICodes.Error.IBM2462I.fullCode,
          //     range: getSyntaxNodeRange(node)!,
          //     uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
          //     // property: "returnAttributes",
          //     // node
          //   },
          // );
        }
      }
    }
  }

  /**
   * Verify label references
   */
  checkLabelReference(
    node: AST.LabelReference,
    acceptor: ValidationAcceptor,
  ): void {
    if (node.label && !node.label.node) {
      // TODO: Reimplement this validation and add tests
      // acceptor(Severity.W, PLICodes.Warning.IBM3332I.message, {
      //   code: PLICodes.Warning.IBM3332I.fullCode,
      //   range: getSyntaxNodeRange(node)!,
      //   uri: "", // TODO @montymxb Still need to supply URI for this document we're
      //   // property: "label"
      //   // node
      // });
      // // add Error.IBM1316I as well
      // acceptor(Severity.E, PLICodes.Error.IBM1316I.message, {
      //   code: PLICodes.Error.IBM1316I.fullCode,
      //   range: getSyntaxNodeRange(node)!,
      //   uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
      //   // property: "label",
      //   // node
      // });
    }
  }

  /**
   * Validate call statements to external declarations (requires an entry check)
   */
  checkCallStatement(
    node: AST.CallStatement,
    acceptor: ValidationAcceptor,
  ): void {
    // const ref = node.call.procedure.ref;
    const ref = node.call?.procedure?.node;
    // node.call.procedure
    if (ref && ref.kind === AST.SyntaxKind.DeclaredVariable) {
      // get the parent of the declared variable
      const parent = ref.container as AST.DeclaredItem;
      if (parent.kind === AST.SyntaxKind.DeclaredItem) {
        // check if it has the 'entry' attribute
        // if (!parent.attributes.some((attr) => isEntryAttribute(attr))) {
        if (
          !parent.attributes.some(
            (attr) => attr.kind === AST.SyntaxKind.EntryAttribute,
          )
        ) {
          // TODO: Reimplement this validation and add tests
          // acceptor(Severity.S, PLICodes.Severe.IBM1695I.message, {
          //   code: PLICodes.Severe.IBM1695I.fullCode,
          //   range: getSyntaxNodeRange(node)!,
          //   uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
          //   // node,
          //   // property: "call",
          // });

          // also flag when we have any sort of args list (even an empty one) present after the call
          if (node.call?.args1) {
            // acceptor(
            //   Severity.E,
            //   PLICodes.Error.IBM1231I.message(node.call?.procedure?.text!),
            //   {
            //     code: PLICodes.Error.IBM1231I.fullCode,
            //     range: getSyntaxNodeRange(node)!,
            //     uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
            //     // node: node.call,
            //     // property: "args"
            //   },
            // );
          }
        }
      }
    }
  }

  /**
   * Ensure ordinal statements don't have conflicting attributes, and only 1 precision attribute
   */
  checkDefineOrdinalStatement(
    node: AST.DefineOrdinalStatement,
    acceptor: ValidationAcceptor,
  ): void {
    // get attributes
    const attrs = node.attributes;
    const attrSet = new Set<string>();
    for (const attr of attrs) {
      const lattr = attr.toLowerCase();
      if (
        (lattr === "signed" && attrSet.has("unsigned")) ||
        (lattr === "unsigned" && attrSet.has("signed"))
      ) {
        // TODO: Reimplement this validation and add tests
        // mutually exclusive attributes
        // acceptor(
        //   Severity.W,
        //   "Signed & unsigned attributes are mutually exclusive, ideally only one should be specified.",
        //   {
        //     // node,
        //     range: getSyntaxNodeRange(node)!,
        //     uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
        //     // property: "attributes"
        //   },
        // );
      } else if (lattr.match(/prec/) && attrSet.has("prec")) {
        // TODO: Reimplement this validation and add tests
        // don't allow multiple precision attributes
        // acceptor(
        //   Severity.W,
        //   "Multiple precision attributes will result in only one taking effect, ideally only one should be specified.",
        //   {
        //     // node,
        //     range: getSyntaxNodeRange(node)!,
        //     uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
        //     // property: "attributes",
        //   },
        // );
      } else {
        // add it in, normalizing precision & prec to 'prec' along the way
        attrSet.add(lattr.match(/prec/) ? "prec" : lattr);
      }
    }
  }
}
