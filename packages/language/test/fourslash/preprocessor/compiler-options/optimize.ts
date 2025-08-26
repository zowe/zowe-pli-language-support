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
////*PROCESS NOOPTIMIZE;
////*PROCESS <|1:OPTIMIZE|>;
////*PROCESS <|2:OPTIMIZE|>(<|3:INVALID|>);
////*PROCESS <|4:OPTIMIZE|>(0, 3, TIME);

verify.noDiagnosticsExceptAt(1, [
  new RegExp(
    code.CompilerOptions.MutexOptionIssue.message("").substring(0, 20),
  ),
]);
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Optimize.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt([1, 2, 4], {
  message: code.CompilerOptions.MutexOptionIssue.message("OPTIMIZE"),
});
verify.expectCompilerOptions({
  optimize: 3,
});
