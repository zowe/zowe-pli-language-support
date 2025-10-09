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
////*PROCESS <|1:NOSERVICE|>;
////*PROCESS <|2:SERVICE|>;
////*PROCESS <|4:SERVICE|>(<|5:)|>;
////*PROCESS <|6:SERVICE|>(<|7:"xXx"|>);
////*PROCESS <|8:SERVICE|>(<|9:'yYy'|>);
////*PROCESS <|10:SERVICE|>(<|11:xxxxxxxxx1xxxxxxxxx2xxxxxxxxx3xxxxxxxxx4xxxxxxxxx5xxxxxxxxx6xxxxxxxxx7xxxxxxxxx8|>);
////*PROCESS <|12:SERVICE|>(xYz);

verify.noDiagnostics([1, 7, 9]);
verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("SERVICE"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Service.InvalidEmptyPlainParameter.message(),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Service.InvalidParameterLength.message("80"),
});
verify.expectCompilerOptions({
  service: "XYZ", // Checked capitalization on the mainframe.
});
