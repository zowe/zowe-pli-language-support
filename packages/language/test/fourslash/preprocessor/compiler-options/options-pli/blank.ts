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
////*PROCESS <|2:BLANK|>;
////*PROCESS <|4:BLANK|>(<|5:)|>;
////*PROCESS <|6:BLANK|>(<|7:''|>);
////*PROCESS <|8:BLANK|>(<|9:'D'|>);
////*PROCESS <|10:BLANK|>(<|11:'$$$##'|>);
////*PROCESS <|12:BLANK|>('#');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12], {
  message: code.CompilerOptions.DupeOptionIssue.message("BLANK"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedString.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Blank.InvalidParameterLength.message(""),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Blank.InvalidParameter.message("D"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Blank.InvalidParameterLength.message("$$$##"),
});
verify.expectCompilerOptions({
  blank: "#",
});
