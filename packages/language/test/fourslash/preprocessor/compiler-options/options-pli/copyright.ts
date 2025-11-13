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
////*PROCESS <|2:NOCOPYRIGHT|>;
////*PROCESS <|4:NOCOPYRIGHT|>();
////*PROCESS <|6:COPYRIGHT|>;
////*PROCESS <|8:COPYRIGHT|>(<|9:INVALID|>);
////*PROCESS <|10:COPYRIGHT|>(<|11:'\$1k'|>);
////*PROCESS <|12:COPYRIGHT|>('This is a valid copyright notice.');

verify.noDiagnostics(2);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOCOPYRIGHT"),
});
verify.expectDiagnosticsAt([6, 8, 10, 12], {
  message: code.CompilerOptions.MutexOptionIssue.message("COPYRIGHT"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Copyright.InvalidParameterLength.message(
    "x".repeat(1024),
  ),
});
verify.expectCompilerOptions({
  copyright: "This is a valid copyright notice.",
});
