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

import type { ValidationChecks } from "langium";
import type { Pl1AstType } from "../generated/ast.js";
import type { Pl1Services } from "../pli-module.js";
// Remove until grammar support for dimensions work as expected
// import { IBM1295IE_sole_bound_specified } from './messages/IBM1295IE-sole-bound-specified.js';
import { IBM1324IE_name_occurs_more_than_once_within_exports_clause } from "./messages/IBM1324IE-name-occurs-more-than-once-within-exports-clause.js";
import { IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute } from "./messages/IBM1388IE-NODESCRIPTOR-attribute-is-invalid-when-any-parameter-has-NONCONNECTED-attribute.js";
import { IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned } from "./messages/IBM1747IS-Function-cannot-be-used-before-the-functions-descriptor-list-has-been-scanned.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Pl1Services) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.Pl1Validator;
  const checks: ValidationChecks<Pl1AstType> = {
    // DimensionBound: [IBM1295IE_sole_bound_specified],
    Exports: [IBM1324IE_name_occurs_more_than_once_within_exports_clause],
    MemberCall: [
      IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned,
    ],
    ProcedureStatement: [
      IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute,
    ],
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Pl1Validator {}
