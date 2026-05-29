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
////*PROCESS DEFAULT(<|1:ASGN|>, <|3:NONASGN|>);
////*PROCESS <|4:DEFAULT|>(<|5:CONN|>, <|7:NONCONN|>);
////*PROCESS <|8:DEFAULT|>(<|9:INL|>, <|11:NOINL|>);

verify.expectDiagnosticsAt([4, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("DEFAULT"),
});
verify.noDiagnostics([1, 5, 9]);
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("DEFAULT(NONASGN)"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.MutexOptionIssue.message("DEFAULT(NONCONN)"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.MutexOptionIssue.message("DEFAULT(NOINL)"),
});
verify.expectCompilerOptions({
  default: {
    assignable: false,
    connected: false,
    inline: false,
  },
});
