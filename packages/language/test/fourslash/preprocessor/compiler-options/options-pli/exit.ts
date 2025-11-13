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
////*PROCESS <|2:NOEXIT|>;
////*PROCESS <|4:NOEXIT|>();
////*PROCESS <|6:EXIT|>;
////*PROCESS <|8:EXIT|>(<|9:)|>;
////*PROCESS <|10:EXIT|>(<|11:VALID|>);
////*PROCESS <|12:EXIT|>(<|13:'\$1k'|>);
////*PROCESS <|14:EXIT|>('exit');

verify.noDiagnostics(2);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOEXIT"),
});
verify.expectDiagnosticsAt([6, 8, 10, 12, 14], {
  message: code.CompilerOptions.MutexOptionIssue.message("EXIT"),
});
verify.noDiagnosticsExceptAt([6, 11], [code.CompilerOptions.MutexOptionIssue]);
verify.expectDiagnosticsAt(9, code.CompilerOptions.Exit.InvalidEmptyParameter);
verify.expectDiagnosticsAt(
  13,
  code.CompilerOptions.Exit.InvalidParameterLength,
);
verify.expectCompilerOptions({
  exit: "exit",
});
