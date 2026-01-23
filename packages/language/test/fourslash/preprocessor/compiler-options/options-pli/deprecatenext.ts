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
////*PROCESS <|2:DEPRECATENEXT|>;
////*PROCESS <|4:DEPRECATENEXT|>(<|5:)|>;
////*PROCESS <|8:DEPRECATENEXT|>(<|9:INVALID|>);
////*PROCESS <|10:DEPRECATENEXT|>(<|11:INVALID|>());
////*PROCESS <|12:DEPRECATENEXT|>(STMT(<|13:INVALID|>));
////*PROCESS <|14:DEPRECATENEXT|>(STMT(ALLOCATE));
////*PROCESS <|16:DEPRECATENEXT|>(BUILTIN(STRLEN));
////*PROCESS <|18:DEPRECATENEXT|>(ENTRY(MAIN));
////*PROCESS <|20:DEPRECATENEXT|>(INCLUDE(LIB));
////*PROCESS <|22:DEPRECATENEXT|>(VARIABLE(FOO));

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Deprecate.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(13, {
  message:
    code.CompilerOptions.Deprecate.InvalidStatementParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  deprecateNext: {
    BUILTIN: new Set(["STRLEN"]),
    ENTRY: new Set(["MAIN"]),
    INCLUDE: new Set(["LIB"]),
    STMT: new Set(["ALLOCATE"]),
    VARIABLE: new Set(["FOO"]),
  },
});
