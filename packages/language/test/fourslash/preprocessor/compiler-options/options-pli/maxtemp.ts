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
////*PROCESS <|1:MAXTEMP|>;
////*PROCESS <|2:MAXTEMP|>(<|3:)|>;
////*PROCESS <|4:MAXTEMP|>(<|5:INVALID|>);
////*PROCESS <|6:MAXTEMP|>(<|7:-5|>);
////*PROCESS <|8:MAXTEMP|>(8M);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("MAXTEMP"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 1),
});
verify.expectCompilerOptions({
  maxTemp: 8 * 1024 * 1024,
});
