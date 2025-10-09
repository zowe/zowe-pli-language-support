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
////*PROCESS <|1:PRO|>;
////*PROCESS <|2:PROCEED|>();
////*PROCESS <|4:NOPROCEED|>(<|5:)|>;
////*PROCESS <|6:NOPROCEED|>(<|7:INVALID|>);
////*PROCESS <|8:NPRO|>(S, W);
////*PROCESS <|10:NOPROCEED|>;

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("PROCEED"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([4, 6, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOPROCEED"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.MutexOptionIssue.message("NPRO"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Proceed.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.InvalidParameterCount.message(2, 0, 1),
});
verify.expectCompilerOptions({
  proceed: { noProceed: "I" },
});
