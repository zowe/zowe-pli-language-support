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
////*PROCESS <|2:NODBRMLIB|>;
////*PROCESS <|4:NODBRMLIB|>();
////*PROCESS <|6:DBRMLIB|>;
////*PROCESS <|8:DBRMLIB|>(<|9:)|>;
////*PROCESS <|10:DBRMLIB|>(<|11:VALID|>);
////*PROCESS <|12:DBRMLIB|>('dbrm');

verify.noDiagnostics(2);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("NODBRMLIB"),
});
verify.expectDiagnosticsAt([6, 8, 10, 12], {
  message: code.CompilerOptions.MutexOptionIssue.message("DBRMLIB"),
});
verify.noDiagnosticsExceptAt([6, 11], [code.CompilerOptions.MutexOptionIssue]);
verify.expectDiagnosticsAt(
  9,
  code.CompilerOptions.DBRMLib.InvalidEmptyParameter,
);
verify.expectCompilerOptions({
  dbrmlib: "dbrm",
});
