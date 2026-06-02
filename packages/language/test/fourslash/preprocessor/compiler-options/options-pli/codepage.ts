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
////*PROCESS <|2:CODEPAGE|>;
////*PROCESS <|4:CODEPAGE|>(<|5:)|>;
////*PROCESS <|6:CODEPAGE|>(<|7:INVALID|>);
////*PROCESS <|8:CP|>(00037);
////*PROCESS <|10:CP|>(<|11:1140|>);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6], {
  message: code.CompilerOptions.DupeOptionIssue.message("CODEPAGE"),
});
verify.expectDiagnosticsAt([8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("CP"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.CodePage.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics(11);
verify.expectCompilerOptions({
  codepage: "01140",
});
