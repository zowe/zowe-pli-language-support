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
////*PROCESS NOOPTIONS;
////*PROCESS <|1:NOP|>;
////*PROCESS <|2:OP|>;
////*PROCESS <|4:OPTIONS|>(<|5:)|>;
////*PROCESS <|6:OPTIONS|>(<|7:INVALID|>);
////*PROCESS <|8:OPTIONS|>(ALL);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOP"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Options.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("OP"),
});
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.MutexOptionIssue.message("OPTIONS"),
});
verify.expectCompilerOptions({
  options: "ALL",
});
