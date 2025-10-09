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
////*PROCESS <|1:SEM|>;
////*PROCESS <|2:SEMANTIC|>();
////*PROCESS <|4:NOSEMANTIC|>(<|5:)|>;
////*PROCESS <|6:NOSEMANTIC|>(<|7:INVALID|>);
////*PROCESS <|8:NSEM|>(S, W);
////*PROCESS <|10:NOSEMANTIC|>;

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("SEMANTIC"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([4, 6, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOSEMANTIC"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.MutexOptionIssue.message("NSEM"),
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
  semantic: { noSemantic: "I" },
});
