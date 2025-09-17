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
////*PROCESS <|1:MAXMSG|>;
////*PROCESS <|2:MAXMSG|>(<|3:)|>;
////*PROCESS <|4:MAXMSG|>(<|5:INVALID|>);
////*PROCESS <|6:MAXMSG|>(<|7:-5|>);
////*PROCESS <|8:MAXMSG|>(<|9:E|>);
////*PROCESS <|10:MAXMSG|>(<|11:0|>);
////*PROCESS <|12:MAXMSG|>(<|13:I, 200, E, 20, 5, W, 100|>);
////*PROCESS <|14:MAXMSG|>(<|15:I 200 E 20 5 W 100|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8, 10, 12, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXMSG"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 0, 32767),
});
verify.noDiagnostics([3, 9, 11, 13, 15]);
verify.expectCompilerOptions({
  maxmsg: {
    severity: "W",
    n: 100,
  },
});
