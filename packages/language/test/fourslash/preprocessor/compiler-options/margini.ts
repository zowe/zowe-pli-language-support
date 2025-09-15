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
////*PROCESS NOMARGINI;
////*PROCESS <|1:NOMARGINI|>();
////*PROCESS <|2:MARGINI|>(<|3:)|>;
////*PROCESS <|4:MARGINI|>(<|5:INVALID|>);
////*PROCESS <|6:MARGINI|>(<|7:"INVALID"|>);
////*PROCESS <|8:MARGINI|>(<|9:''|>);
////*PROCESS <|10:NMI|>;
////*PROCESS <|12:MI|>('c');

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOMARGINI"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([2, 4, 6, 8], {
  message: code.CompilerOptions.MutexOptionIssue.message("MARGINI"),
});
verify.expectDiagnosticsAt([3, 5], {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Margini.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(10, {
  message: code.CompilerOptions.DupeOptionIssue.message("NMI"),
});
verify.expectDiagnosticsAt(12, {
  message: code.CompilerOptions.MutexOptionIssue.message("MI"),
});
verify.noDiagnostics(9);
verify.expectCompilerOptions({
  margini: "c",
});
