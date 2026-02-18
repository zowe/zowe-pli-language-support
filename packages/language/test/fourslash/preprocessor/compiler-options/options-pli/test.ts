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
////*PROCESS NOTEST;
////*PROCESS <|TEST|>;
////*PROCESS <|TEST|>();
////*PROCESS <|TEST|>(<|5:INVALID|>);
////*PROCESS <|TEST|>(<|7:BLOCK|>);
////*PROCESS <|TEST|>(<|9:NOSEPARATE, NOSOURCE|>);
////*PROCESS <|TEST|>(<|11:SYM NOHOOK SEPNAME|>);

verify.expectDiagnosticsAt("TEST", {
  message: code.CompilerOptions.MutexOptionIssue.message("TEST"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Test.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  test: {
    level: constants.CompilerOptions.TestLevel.ALL,
    hook: false,
    separate: false,
    sepName: true,
    source: false,
    sym: true,
  },
});
