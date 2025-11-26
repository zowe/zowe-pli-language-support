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
////*PROCESS <|1:SPILL|>;
////*PROCESS <|2:SPILL|>(<|3:)|>;
////*PROCESS <|4:SPILL|>(<|5:INVALID|>);
////*PROCESS <|6:SPILL|>(<|7:-5|>);
////*PROCESS <|8:SP|>(<|9:5k|>);
////*PROCESS <|10:SP|>(1024);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 4, 6], {
  message: code.CompilerOptions.DupeOptionIssue.message("SPILL"),
});
verify.expectDiagnosticsAt([8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("SP"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 0, 3900),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumberRange.message(5 * 1024, 0, 3900),
});
verify.expectCompilerOptions({
  spill: 1024,
});
