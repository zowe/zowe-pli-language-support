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

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS <|2:PPMACRO|>;
////*PROCESS <|4:PPMACRO|>(<|5:)|>;
////*PROCESS <|6:PPMACRO|>(<|7:INVALID|>);
////*PROCESS <|8:PPMACRO|>(<|9:''|>);
////*PROCESS <|10:PPMACRO|>(<|11:'   '|>);
////*PROCESS <|12:PPMACRO|>('CASE(UPPER)');
////*PROCESS <|14:PPMACRO|>(<|15:'abc'|>);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("PPMACRO"),
});
verify.expectDiagnosticsAt([5, 7], {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.noDiagnostics([9, 11, 15]);
verify.expectCompilerOptions({
  macroOptions: {
    case: {
      case: constants.CompilerOptions.Macro.Case.UPPER,
      explicitlySet: true,
    },
  },
});
