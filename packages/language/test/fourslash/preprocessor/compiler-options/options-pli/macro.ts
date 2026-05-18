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
////*PROCESS NOMACRO;
////*PROCESS <|1:MACRO|>();
////*PROCESS <|2:MACRO|>;
////*PROCESS <|3:NM|>;
////*PROCESS <|4:M|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([1, 2], {
  message: code.CompilerOptions.MutexOptionIssue.message("MACRO"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.DupeOptionIssue.message("NM"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.MutexOptionIssue.message("M"),
});
verify.expectCompilerOptions({
  macro: true,
});
