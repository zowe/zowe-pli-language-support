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
////*PROCESS <|1:SYN|>;
////*PROCESS <|2:SYNTAX|>();
////*PROCESS <|4:NOSYNTAX|>(<|5:)|>;
////*PROCESS <|6:NOSYNTAX|>(<|7:INVALID|>);
////*PROCESS <|8:NSYN|>(S, W);
////*PROCESS <|10:NOSYNTAX|>;

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("SYNTAX"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([4, 6, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOSYNTAX"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.MutexOptionIssue.message("NSYN"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Semantic.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.InvalidParameterCount.message(2, 0, 1),
});
verify.expectCompilerOptions({
  syntax: { noSyntax: "I" },
});
