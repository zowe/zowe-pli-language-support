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
////*PROCESS <|1:NATLANG|>;
////*PROCESS <|2:NATLANG|>(<|3:)|>;
////*PROCESS <|4:NATLANG|>(<|5:INVALID|>);
////*PROCESS <|6:NATLANG|>(UEN);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.NatLang.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt([2, 4, 6], {
  message: code.CompilerOptions.DupeOptionIssue.message("NATLANG"),
});
verify.expectCompilerOptions({
  natlang: constants.CompilerOptions.NatLang.UEN,
});
