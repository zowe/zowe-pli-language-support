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
////*PROCESS <|1:MAXRUNONIF|>;
////*PROCESS <|2:MAXRUNONIF|>(<|3:)|>;
////*PROCESS <|4:MAXRUNONIF|>(<|5:INVALID|>);
////*PROCESS <|6:MAXRUNONIF|>(<|7:-5|>);
////*PROCESS <|8:MAXRUNONIF|>(<|9:1001|>);
////*PROCESS <|10:MAXRUNONIF|>(12);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXRUNONIF"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 2, 1000),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumberRange.message(1001, 2, 1000),
});
verify.expectCompilerOptions({
  maxRunOnIf: 12,
});
