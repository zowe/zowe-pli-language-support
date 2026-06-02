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
////*PROCESS NOAGGREGATE;
////*PROCESS <|1:NAG|>;
////*PROCESS <|2:AGGREGATE|>;
////*PROCESS <|4:AGGREGATE|>(<|5:)|>;
////*PROCESS <|6:AGGREGATE|>(<|7:INVALID|>);
////*PROCESS <|8:AG|>(HEXADEC);
////*PROCESS <|10:NAG|>(DECIMAL);

verify.expectDiagnosticsAt([1, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("NAG"),
});
verify.expectDiagnosticsAt([2, 4, 6], {
  message: code.CompilerOptions.MutexOptionIssue.message("AGGREGATE"),
});
verify.expectDiagnosticsAt([8], {
  message: code.CompilerOptions.MutexOptionIssue.message("AG"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Aggregate.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(10, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectCompilerOptions({
  aggregate: constants.CompilerOptions.Aggregate.HEXADEC,
});
