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
////*PROCESS <|1:NOATTRIBUTES|>;
////*PROCESS <|2:NA|>;
////*PROCESS <|4:ATTRIBUTES|>;
////*PROCESS <|6:ATTRIBUTES|>(<|7:)|>;
////*PROCESS <|8:ATTRIBUTES|>(<|9:INVALID|>);
////*PROCESS <|10:ATTRIBUTES|>(<|11:FULL|>);
////*PROCESS <|12:ATTRIBUTES|>(<|13:F|>);
////*PROCESS <|14:ATTRIBUTES|>(<|15:SHORT|>);
////*PROCESS <|16:A|>(<|17:S|>);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("NA"),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12, 14], {
  message: code.CompilerOptions.MutexOptionIssue.message("ATTRIBUTES"),
});
verify.expectDiagnosticsAt(16, {
  message: code.CompilerOptions.MutexOptionIssue.message("A"),
});
verify.noDiagnosticsExceptAt(4, [
  code.CompilerOptions.MutexOptionIssue.message("ATTRIBUTES"),
]);
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Attributes.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics([11, 13, 15, 17]);
verify.expectCompilerOptions({
  attributes: constants.CompilerOptions.Length.SHORT,
});
