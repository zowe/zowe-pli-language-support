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
////*PROCESS <|1:MAXNEST|>;
////*PROCESS <|2:MAXNEST|>(<|3:)|>;
////*PROCESS <|4:MAXNEST|>(<|5:INVALID|>);
////*PROCESS <|6:MAXNEST|>(DO(<|7:100|>));
////*PROCESS <|8:MAXNEST|>(IF(<|9:0|>));
////*PROCESS <|12:MAXNEST|>(<|13:BLOCK(50), DO(50), IF(50)|>);
////*PROCESS <|14:MAXNEST|>(<|15:BLOCK(40) DO(40) IF (40)|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8, 12, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXNEST"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedOption.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(100, 1, 50),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumberRange.message(0, 1, 50),
});
verify.noDiagnostics([13, 15]);
verify.expectCompilerOptions({
  maxnest: {
    block: 40,
    do: 40,
    if: 40,
  },
});
