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

import type { ValidationAcceptor, ValidationChecks } from "langium";
import {
  isComputationDataAttribute,
  type LabelReference,
  type Pl1AstType,
  type PliProgram,
  type ReturnsOption,
} from "../generated/ast.js";
import type { Pl1Services } from "../pli-module.js";
// Remove until grammar support for dimensions work as expected
// import { IBM1295IE_sole_bound_specified } from './messages/IBM1295IE-sole-bound-specified.js';
import { IBM1324IE_name_occurs_more_than_once_within_exports_clause } from "./messages/IBM1324IE-name-occurs-more-than-once-within-exports-clause.js";
import { IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute } from "./messages/IBM1388IE-NODESCRIPTOR-attribute-is-invalid-when-any-parameter-has-NONCONNECTED-attribute.js";
import { IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned } from "./messages/IBM1747IS-Function-cannot-be-used-before-the-functions-descriptor-list-has-been-scanned.js";
import { Error as PLIError, Severe, Warning } from "./messages/pli-codes.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Pl1Services) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.Pl1Validator;
  const checks: ValidationChecks<Pl1AstType> = {
    // DimensionBound: [IBM1295IE_sole_bound_specified],
    PliProgram: [validator.checkPliProgram],
    Exports: [IBM1324IE_name_occurs_more_than_once_within_exports_clause],
    ReturnsOption: [validator.checkReturnsOption],
    MemberCall: [
      IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned,
    ],
    ProcedureStatement: [
      IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute,
    ],
    LabelReference: [validator.checkLabelReference],
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Pl1Validator {
  /**
   * Verify programs contain at least one parsed statement
   */
  checkPliProgram(node: PliProgram, acceptor: ValidationAcceptor): void {
    if (node.statements.length === 0) {
      acceptor("error", Severe.IBM1917I.message, {
        code: Severe.IBM1917I.fullCode,
        node,
        property: "statements",
      });
    }
  }

  /**
   * Checks return options for mutually exclusive attributes
   */
  checkReturnsOption(node: ReturnsOption, acceptor: ValidationAcceptor): void {
    const attrSet = new Set<string>();
    for (const attr of node.returnAttribute) {
      if (isComputationDataAttribute(attr)) {
        const typ = attr.type.toUpperCase();
        attrSet.add(typ); // dupes are ok

        // look for a generally negated version of this attribute (there are several)
        if (attrSet.has(`UN${typ}`)) {
          acceptor("error", PLIError.IBM2462I.message(typ, `UN${typ}`), {
            code: PLIError.IBM2462I.fullCode,
            node,
            property: "returnAttribute",
          });
        }

        // look for a non-negated version of this type
        if (typ.startsWith("UN") && attrSet.has(typ.slice(2))) {
          acceptor("error", PLIError.IBM2462I.message(typ, typ.slice(2)), {
            code: PLIError.IBM2462I.fullCode,
            node,
            property: "returnAttribute",
          });
        }
      }
    }
  }

  /**
   * Verify label references
   */
  checkLabelReference(
    node: LabelReference,
    acceptor: ValidationAcceptor,
  ): void {
    if (node.label && !node.label.ref) {
      acceptor("warning", Warning.IBM3332I.message, {
        code: Warning.IBM3332I.fullCode,
        node,
        property: "label",
      });

      // add Error.IBM1316I as well
      acceptor("error", PLIError.IBM1316I.message, {
        code: PLIError.IBM1316I.fullCode,
        node,
        property: "label",
      });
    }
  }
}
