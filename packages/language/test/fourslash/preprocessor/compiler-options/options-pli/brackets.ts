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
////*PROCESS <|2:BRACKETS|>;
////*PROCESS <|4:BRACKETS|>(<|5:)|>;
////*PROCESS <|6:BRACKETS|>(<|7:''|>);
////*PROCESS <|8:BRACKETS|>(<|9:'DD'|>);
////*PROCESS <|10:BRACKETS|>(<|11:'$$$##'|>);
////*PROCESS <|12:BRACKETS|>('[[');
////*PROCESS <|14:BRACKETS|>('#$');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("BRACKETS"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Brackets.InvalidParameterLength.message(""),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Brackets.InvalidParameter.message("DD"),
});
verify.expectDiagnosticsAt(11, {
  message:
    code.CompilerOptions.Brackets.InvalidParameterLength.message("$$$##"),
});
verify.expectCompilerOptions({
  brackets: ["#", "$"],
});
