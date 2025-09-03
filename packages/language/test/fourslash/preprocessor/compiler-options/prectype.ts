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

/// <reference path="../../framework.ts" />

// @wrap: process
////*PROCESS <|1:PRECTYPE|>;
////*PROCESS <|2:PRECTYPE|>(<|3:)|>;
////*PROCESS <|4:PRECTYPE|>(<|5:INVALID|>);
////*PROCESS <|6:PRECTYPE|>(ANS, DECDIGIT);
////*PROCESS <|8:PRECTYPE|>(DECDIGIT);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 2, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("PRECTYPE"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.PrecType.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.InvalidParameterCount.message(2, 1, 1),
});
verify.expectCompilerOptions({
  precType: "DECDIGIT",
});
