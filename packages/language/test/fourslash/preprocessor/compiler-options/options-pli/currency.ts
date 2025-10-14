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
////*PROCESS <|2:CURRENCY|>;
////*PROCESS <|4:CURRENCY|>(<|5:)|>;
////*PROCESS <|6:CURRENCY|>(<|7:''|>);
////*PROCESS <|8:CURRENCY|>(<|9:D|>);
////*PROCESS <|10:CURRENCY|>(<|11:'xx'|>);
////*PROCESS <|12:CURR|>('x');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("CURRENCY"),
});
verify.expectDiagnosticsAt(12, {
  message: code.CompilerOptions.DupeOptionIssue.message("CURR"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Currency.InvalidParameterLength.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Currency.InvalidParameterLength.message(""),
});
verify.noDiagnostics(9);
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Currency.InvalidParameterLength.message("xx"),
});
verify.expectCompilerOptions({
  currency: "x",
});
