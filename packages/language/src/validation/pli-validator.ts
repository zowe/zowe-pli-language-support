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
  getSyntaxNodeRange,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import * as AST from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { IBM1324IE_name_occurs_more_than_once_within_exports_clause } from "./messages/IBM1324IE-name-occurs-more-than-once-within-exports-clause.js";
import { IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute } from "./messages/IBM1388IE-NODESCRIPTOR-attribute-is-invalid-when-any-parameter-has-NONCONNECTED-attribute.js";
import * as PLICodes from "./messages/pli-codes";
import { PliValidationAcceptor } from "./validator";

/**
 * A function that accepts a diagnostic for PL/I validation
 */
export type PliValidationFunction = (
  node: any,
  acceptor: PliValidationAcceptor,
) => void;

export type SyntaxKindStrings = keyof typeof AST.SyntaxKind;

export type PliValidationChecks = Partial<
  Record<SyntaxKindStrings, PliValidationFunction | PliValidationFunction[]>
>;

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(): PliValidationChecks {
  const validator = new Pl1Validator();
  const checks: PliValidationChecks = {
    // DimensionBound: [IBM1295IE_sole_bound_specified],
    PliProgram: [validator.checkPliProgram],
    Exports: [IBM1324IE_name_occurs_more_than_once_within_exports_clause],
    ReturnsOption: [validator.checkReturnsOption],
    // TODO @montymxb Mar. 27th, 2025: Needs to have a way to readily access the containing 'document' (SourceFile) to compare the offsets (see def)
    // MemberCall: [IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned],
    ProcedureStatement: [
      IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute,
    ],
    LabelReference: [validator.checkLabelReference],
    CallStatement: [validator.checkCallStatement],
    DefineOrdinalStatement: [validator.checkDefineOrdinalStatement],
    DeclareStatement: [validator.checkDeclareStatement],
  };

  return checks;
}

/**
 * Implementation of custom validations.
 */
export class Pl1Validator {
  /**
   * Verify programs contain at least one parsed statement
   */
  checkPliProgram(node: AST.PliProgram, acceptor: PliValidationAcceptor): void {
    if (node.statements.length === 0) {
      acceptor(Severity.S, PLICodes.Severe.IBM1917I.message, {
        code: PLICodes.Severe.IBM1917I.fullCode,
        range: getSyntaxNodeRange(node)!,
        uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
      });
    }
  }

  checkDeclareStatement(
    node: AST.DeclareStatement,
    accept: PliValidationAcceptor,
  ): void {
    const checkNode = (hasLevel: boolean) => (child: AST.SyntaxNode) => {
      if (child.kind === AST.SyntaxKind.DeclaredItem) {
        if (hasLevel && child.levelToken) {
          const uri = tokenToUri(child.levelToken);
          const range = tokenToRange(child.levelToken);

          if (uri) {
            accept(Severity.E, PLICodes.Error.IBM1376I.message, {
              code: PLICodes.Error.IBM1376I.fullCode,
              range,
              uri,
            });
          }
        }

        const childHasLevel = child.level !== undefined;
        const nextCheckNode = checkNode(childHasLevel);
        child.elements.forEach(nextCheckNode);
      } else {
        forEachNode(child, checkNode(false));
      }
    };

    node.items.forEach(checkNode(false));
  }

  /**
   * Checks return options for mutually exclusive attributes
   */
  checkReturnsOption(
    node: AST.ReturnsOption,
    acceptor: PliValidationAcceptor,
  ): void {
    const attrSet = new Set<string>();
    for (const attr of node.returnAttributes) {
      if (attr.kind === AST.SyntaxKind.ComputationDataAttribute) {
        const typ = attr.type!.toUpperCase();
        attrSet.add(typ); // dupes are ok

        // look for a generally negated version of this attribute (there are several)
        if (attrSet.has(`UN${typ}`)) {
          acceptor(
            Severity.E,
            PLICodes.Error.IBM2462I.message(typ, `UN${typ}`),
            {
              code: PLICodes.Error.IBM2462I.fullCode,
              range: getSyntaxNodeRange(node)!,
              uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
              // property: "returnAttributes",
              // node
            },
          );
        }

        // look for a non-negated version of this type
        if (typ.startsWith("UN") && attrSet.has(typ.slice(2))) {
          acceptor(
            Severity.E,
            PLICodes.Error.IBM2462I.message(typ, typ.slice(2)),
            {
              code: PLICodes.Error.IBM2462I.fullCode,
              range: getSyntaxNodeRange(node)!,
              uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
              // property: "returnAttributes",
              // node
            },
          );
        }
      }
    }
  }

  /**
   * Verify label references
   */
  checkLabelReference(
    node: AST.LabelReference,
    acceptor: PliValidationAcceptor,
  ): void {
    if (node.label && !node.label.node) {
      acceptor(Severity.W, PLICodes.Warning.IBM3332I.message, {
        code: PLICodes.Warning.IBM3332I.fullCode,
        range: getSyntaxNodeRange(node)!,
        uri: "", // TODO @montymxb Still need to supply URI for this document we're
        // property: "label"
        // node
      });

      // add Error.IBM1316I as well
      acceptor(Severity.E, PLICodes.Error.IBM1316I.message, {
        code: PLICodes.Error.IBM1316I.fullCode,
        range: getSyntaxNodeRange(node)!,
        uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
        // property: "label",
        // node
      });
    }
  }

  /**
   * Validate call statements to external declarations (requires an entry check)
   */
  checkCallStatement(
    node: AST.CallStatement,
    acceptor: PliValidationAcceptor,
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
          acceptor(Severity.S, PLICodes.Severe.IBM1695I.message, {
            code: PLICodes.Severe.IBM1695I.fullCode,
            range: getSyntaxNodeRange(node)!,
            uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
            // node,
            // property: "call",
          });

          // also flag when we have any sort of args list (even an empty one) present after the call
          if (node.call?.args1) {
            acceptor(
              Severity.E,
              PLICodes.Error.IBM1231I.message(node.call?.procedure?.text!),
              {
                code: PLICodes.Error.IBM1231I.fullCode,
                range: getSyntaxNodeRange(node)!,
                uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
                // node: node.call,
                // property: "args"
              },
            );
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
    acceptor: PliValidationAcceptor,
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
        // mutually exclusive attributes
        acceptor(
          Severity.W,
          "Signed & unsigned attributes are mutually exclusive, ideally only one should be specified.",
          {
            // node,
            range: getSyntaxNodeRange(node)!,
            uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
            // property: "attributes"
          },
        );
      } else if (lattr.match(/prec/) && attrSet.has("prec")) {
        // don't allow multiple precision attributes
        acceptor(
          Severity.W,
          "Multiple precision attributes will result in only one taking effect, ideally only one should be specified.",
          {
            // node,
            range: getSyntaxNodeRange(node)!,
            uri: "", // TODO @montymxb Still need to supply URI for this document we're working in
            // property: "attributes",
          },
        );
      } else {
        // add it in, normalizing precision & prec to 'prec' along the way
        attrSet.add(lattr.match(/prec/) ? "prec" : lattr);
      }
    }
  }
}
