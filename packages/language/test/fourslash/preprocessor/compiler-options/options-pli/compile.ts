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
////*PROCESS <|2:COMPILE|>;
////*PROCESS <|4:C|>(<|5:)|>;
////*PROCESS <|6:NOCOMPILE|>;
////*PROCESS <|8:NC|>(<|7:INVALID|>);
////*PROCESS <|10:NOCOMPILE|>(E);

verify.noDiagnostics(2);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("C"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([6, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOCOMPILE"),
});
verify.noDiagnosticsExceptAt(6, [
  code.CompilerOptions.MutexOptionIssue.message("NOCOMPILE"),
]);
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Compile.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.MutexOptionIssue.message("NC"),
});
verify.expectCompilerOptions({
  compile: { noCompile: constants.CompilerOptions.Flag.E },
});
