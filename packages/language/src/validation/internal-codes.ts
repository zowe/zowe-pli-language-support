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

import { Severity } from "../language-server/types";
import { PLICode, Error, Severe } from "./pli-codes";

export const InternalCodes = {
  DiagnosticURIMismatch: {
    code: "_TB0001", // TestBuilder diagnostic code
    severity: Severity.E,
    message: (label: string, file: string, uri: string) =>
      `Expected diagnostic at label "${label}" to be in file "${file}" but received: ${uri}`,
  },
  UnknownIdentifier: {
    code: "UNKNOWN_IDENTIFIER",
    severity: Severity.E,
    message: (name: string) => `Unknown identifier '${name}'`,
  },
  BuiltinAttributeUsage: {
    code: "BUILTIN_ATTRIBUTE_USAGE",
    severity: Severity.E,
    message: (attribute: string) =>
      `The attribute '${attribute}' is a builtin attribute and cannot be used in non-builtin files.`,
  },
  VariadicParameterNotLast: {
    code: "VARIADIC_PARAMETER_NOT_LAST",
    severity: Severity.E,
    message: (name: string) =>
      `The variadic parameter '${name}' must be the last parameter in the parameter list.`,
  },
  VariadicParameterMultiple: {
    code: "VARIADIC_PARAMETER_MULTIPLE",
    severity: Severity.E,
    message: (name: string) =>
      `The variadic parameter '${name}' cannot be used because there is already another variadic parameter in the parameter list.`,
  },
  VariadicParameterIsFixedArray: {
    code: "VARIADIC_PARAMETER_IS_FIXED_ARRAY",
    severity: Severity.E,
    message: (name: string) =>
      `The variadic parameter '${name}' cannot be a fixed array. Variadic parameters must be declared with an assumed size (e.g. (*)) and cannot specify a size.`,
  },
  VariadicParameterNotAnArray: {
    code: "VARIADIC_PARAMETER_NOT_AN_ARRAY",
    severity: Severity.E,
    message: (name: string) =>
      `The variadic parameter '${name}' must be an array. Variadic parameters must be declared with parentheses to indicate they are arrays (e.g. (*)).`,
  },
  VariadicNonParameter: {
    code: "VARIADIC_NON_PARAMETER",
    severity: Severity.E,
    message: (name: string) =>
      `The variadic parameter '${name}' is not a parameter. Only parameters can be variadic.`,
  },
};

export const TypeSystemCodes: PLICode[] = [
  Error.IBM1309I,
  Error.IBM2462I,
  Error.IBM2424I,
  Error.IBM1482I,
  Error.IBM1483I,
  Severe.IBM1629I,
];
