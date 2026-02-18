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
////*PROCESS <|2:CSECTCUT|>;
////*PROCESS <|CSECTCUT|>(<|5:)|>;
////*PROCESS <|CSECTCUT|>(<|7:INVALID|>);
////*PROCESS <|CSECTCUT|>(<|9:-1|>);
////*PROCESS <|CSECTCUT|>(<|11:8|>);
////*PROCESS <|CSECTCUT|>(5);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt("CSECTCUT", {
  message: code.CompilerOptions.DupeOptionIssue.message("CSECTCUT"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.CSectCut.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.CSectCut.InvalidParameter.message("-1"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.CSectCut.InvalidParameter.message("8"),
});
verify.expectCompilerOptions({
  csectcut: 5,
});
