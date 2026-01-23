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
////*PROCESS <|2:DEPRECATE|>;
////*PROCESS <|4:DEPRECATE|>(<|5:)|>;
////*PROCESS <|8:DEPRECATE|>(<|9:INVALID|>);
////*PROCESS <|10:DEPRECATE|>(<|11:INVALID|>());
////*PROCESS <|12:DEPRECATE|>(STMT(<|13:INVALID|>));
////*PROCESS <|14:DEPRECATE|>(STMT(ALLOCATE));
////*PROCESS <|16:DEPRECATE|>(BUILTIN(STRLEN));
////*PROCESS <|18:DEPRECATE|>(ENTRY(MAIN));
////*PROCESS <|20:DEPRECATE|>(INCLUDE(LIB));
////*PROCESS <|22:DEPRECATE|>(VARIABLE(FOO));

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
  deprecate: {
    BUILTIN: new Set(["STRLEN"]),
    ENTRY: new Set(["MAIN"]),
    INCLUDE: new Set(["LIB"]),
    STMT: new Set(["ALLOCATE"]),
    VARIABLE: new Set(["FOO"]),
  },
});
