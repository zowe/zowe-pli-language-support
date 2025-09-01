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

// @wrap: process
////*PROCESS NOMSGSUMMARY;
////*PROCESS <|1:MSGSUMMARY|>;
////*PROCESS <|2:MSGSUMMARY|>(<|3:)|>;
////*PROCESS <|4:MSGSUMMARY|>(<|5:INVALID|>);
////*PROCESS <|6:MSGSUMMARY|>(<|7:NOXREF|> XREF);
////*PROCESS <|8:MSGSUMMARY|>(XREF);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.MutexOptionIssue.message("MSGSUMMARY"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.MsgSummary.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics(7);
verify.expectDiagnosticsAt([1, 2, 4, 6], {
  message: code.CompilerOptions.MutexOptionIssue.message("MSGSUMMARY"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.MutexOptionIssue.message("MSGSUMMARY"),
});
verify.expectCompilerOptions({
  msgSummary: "XREF",
});
