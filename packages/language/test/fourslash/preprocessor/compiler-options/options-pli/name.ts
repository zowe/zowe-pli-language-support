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
////*PROCESS NONAME;
////*PROCESS <|1:NAME|>;
////*PROCESS <|2:NAME|>(<|3:)|>;
////*PROCESS <|4:N|>('XY');

verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt([1, 2], {
  message: code.CompilerOptions.MutexOptionIssue.message("NAME"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.MutexOptionIssue.message("N"),
});
verify.expectCompilerOptions({
  name: "XY",
});
