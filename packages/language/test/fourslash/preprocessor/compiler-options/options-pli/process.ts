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
////*PROCESS NOPROCESS;
////*PROCESS <|2:PROCESS|>;
////*PROCESS <|4:PROCESS|>(<|5:)|>;
////*PROCESS <|6:PROCESS|>(<|7:INVALID|>);
////*PROCESS <|8:PROCESS|>(KEEP DELETE);
////*PROCESS <|10:PROCESS|>(KEEP);

verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("PROCESS"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Process.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.InvalidParameterCount.message(2, 0, 1),
});
verify.expectCompilerOptions({
  process: "KEEP",
});
