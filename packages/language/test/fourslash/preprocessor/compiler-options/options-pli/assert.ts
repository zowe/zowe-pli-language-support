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
////*PROCESS <|2:ASSERT|>;
////*PROCESS <|4:ASSERT|>(<|5:)|>;
////*PROCESS <|6:ASSERT|>(<|7:INVALID|>);
////*PROCESS <|8:ASSERT|>(CONDITION);
////*PROCESS ASSERT(<|9:0|>);
////*PROCESS ASSERT(<|10:1|>);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("ASSERT"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Assert.InvalidParameter.message("INVALID"),
});
// Specifically testing enums reverse mapping
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Assert.InvalidParameter.message("0"),
});
// Specifically testing enums reverse mapping
verify.expectDiagnosticsAt(10, {
  message: code.CompilerOptions.Assert.InvalidParameter.message("1"),
});
verify.expectCompilerOptions({
  assert: constants.CompilerOptions.Assert.CONDITION,
});
