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
////*PROCESS <|2:ARCH|>;
////*PROCESS <|4:ARCH|>(<|5:)|>;
////*PROCESS <|6:ARCH|>(<|7:-1|>);
////*PROCESS <|8:ARCH|>(<|9:15|>);
////*PROCESS <|10:ARCH|>(1);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("ARCH"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-1, 0, 14),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumberRange.message(15, 0, 14),
});
verify.expectCompilerOptions({
  arch: 10,
});
