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
////*PROCESS <|1:TEST|>;
////*PROCESS <|2:TEST|>();
////*PROCESS <|4:TEST|>(<|5:INVALID|>);
////*PROCESS <|6:TEST|>(<|7:BLOCK|>);
////*PROCESS <|8:TEST|>(<|9:NOSEPARATE, NOSOURCE|>);
////*PROCESS <|10:TEST|>(<|11:SYM NOHOOK|>);

verify.noDiagnostics(1);
verify.noDiagnosticsExceptAt(
  [2, 4, 6, 8, 10],
  [new RegExp(code.CompilerOptions.DupeOptionIssue.message("TEST"))],
);
verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("TEST"),
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
