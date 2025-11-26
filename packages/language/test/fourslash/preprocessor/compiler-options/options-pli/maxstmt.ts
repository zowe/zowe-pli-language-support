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
////*PROCESS <|1:MAXSTMT|>;
////*PROCESS <|2:MAXSTMT|>(<|3:)|>;
////*PROCESS <|4:MAXSTMT|>(<|5:INVALID|>);
////*PROCESS <|6:MAXSTMT|>(<|7:0|>);
////*PROCESS <|8:MAXSTMT|>(<|9:4K|>, 2K);
////*PROCESS <|10:MAXSTMT|>(<|11:4K, 4K|>);
////*PROCESS <|12:MAXSTMT|>(8K);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 2),
});
verify.expectDiagnosticsAt([2, 4, 6, 8, 10, 12], {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXSTMT"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(0, 1, undefined),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.MaxStmt.InvalidRange.message(),
});
// TODO ssmifi: This is actually invalid. The options must be changed to prohibit plain nummeric values without comma.
verify.noDiagnostics(11);
verify.expectCompilerOptions({
  maxStmt: {
    m: 8 * 1024,
    n: 8 * 1024,
  },
});
