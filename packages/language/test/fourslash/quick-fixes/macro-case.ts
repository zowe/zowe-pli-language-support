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

/// <reference path="../framework.ts" />

////*process pp(macro("CASE(UPPER)"));
//// dcl <|variable1|> fixed;
//// dcl variable2 char;

verify.expectCompilerOptions({
  macroOptions: {
    case: {
      case: constants.CompilerOptions.Macro.Case.UPPER,
      explicitlySet: true,
    },
  },
});
await verify.expectCodeActionAt(
  "variable1",
  "Convert to uppercase",
  `
  *PROCESS PP(MACRO("CASE(UPPER)"));
  DCL VARIABLE1 FIXED;
  DCL VARIABLE2 CHAR;
`,
);
