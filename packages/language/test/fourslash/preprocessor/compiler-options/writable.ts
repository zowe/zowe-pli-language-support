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
////*PROCESS <|1:WRITABLE|>;
////*PROCESS <|2:WRITABLE|>();
////*PROCESS <|4:NOWRITABLE|>(<|5:)|>;
////*PROCESS <|6:NOWRITABLE|>(<|7:INVALID|>);
////*PROCESS <|8:NOWRITABLE|>;
////*PROCESS <|10:NOWRITABLE|>(<|11:)|>;
////*PROCESS <|12:NOWRITABLE|>(<|13:prv|>);

verify.noDiagnostics([1, 13]);
verify.noDiagnosticsExceptAt(
  [8, 10],
  [new RegExp(code.CompilerOptions.MutexOptionIssue.message("NOWRITABLE"))],
);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("WRITABLE"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOWRITABLE"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Writable.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectCompilerOptions({
  writable: { noWritable: "PRV" },
});
