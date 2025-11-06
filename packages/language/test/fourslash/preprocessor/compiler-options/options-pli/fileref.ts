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
////*PROCESS <|2:NOFILEREF|>;
////*PROCESS <|4:NOFILEREF|>();
////*PROCESS <|6:FILEREF|>;
////*PROCESS <|8:FILEREF|>(<|9:)|>;
////*PROCESS <|10:FILEREF|>(<|11:VALID|>);
////*PROCESS <|12:FILEREF|>(HASH);

verify.noDiagnostics(2);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOFILEREF"),
});
verify.expectDiagnosticsAt([6, 8, 10, 12], {
  message: code.CompilerOptions.MutexOptionIssue.message("FILEREF"),
});
verify.noDiagnosticsExceptAt(6, [code.CompilerOptions.MutexOptionIssue]);
verify.expectDiagnosticsAt(9, code.CompilerOptions.ExpectedPlainNotEmpty);
verify.expectCompilerOptions({
  fileRef: { hash: true },
});
