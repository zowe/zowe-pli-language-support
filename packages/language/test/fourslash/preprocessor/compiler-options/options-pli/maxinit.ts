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
////*PROCESS <|1:MAXINIT|>;
////*PROCESS <|MAXINIT|>(<|3:)|>;
////*PROCESS <|MAXINIT|>(<|5:INVALID|>);
////*PROCESS <|MAXINIT|>(<|7:-5|>);
////*PROCESS <|MAXINIT|>(2222);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt("MAXINIT", {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXINIT"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 0, undefined),
});
verify.expectCompilerOptions({
  maxinit: 2222,
});
