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
////*PROCESS <|1:LINECOUNT|>;
////*PROCESS <|2:LINECOUNT|>(<|3:)|>;
////*PROCESS <|4:LINECOUNT|>(<|5:INVALID|>);
////*PROCESS <|6:LINECOUNT|>(<|7:3|>);
////*PROCESS <|8:LC|>(11411);
////*PROCESS <|9:LINECOUNT|>(44144);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.LineCount.InvalidRange.message("3"),
});
verify.expectDiagnosticsAt([2, 4, 6, 9], {
  message: code.CompilerOptions.DupeOptionIssue.message("LINECOUNT"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.DupeOptionIssue.message("LC"),
});
verify.expectCompilerOptions({
  lineCount: 44144,
});
