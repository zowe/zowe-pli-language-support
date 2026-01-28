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

/// <reference path="../../framework.ts" />

//// %TEST: <|outside>PROC;
////   <|inside>
//// %END;

// Expect PROCEDURE keyword at the start of a procedure definition
completion.expectAt("outside", {
  includes: ["PROCEDURE"],
});
completion.expectAt("inside", {
  includes: [
    // Ensure that the labels don't use percent signs
    "CALL",
    "RETURN",
    // Include all other statement-starting preprocessor keywords
    ...constants.CompletionKeywords.StatementStartPreprocessorInProcedure.valuesArray().map(
      (keyword) => keyword.label,
    ),
  ],
  excludes: [
    // Procedures cannot be nested in the preprocessor
    "PROCEDURE",
    // It also cannot use some of the "normal" PLI statements
    "ATTACH",
    "STOP",
    "WAIT",
  ],
});
