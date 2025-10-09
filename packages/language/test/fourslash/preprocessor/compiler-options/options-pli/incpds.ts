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
////*PROCESS NOINCPDS;
////*PROCESS <|1:INCPDS|>;
////*PROCESS <|2:INCPDS|>(<|3:INVALID|>);
////*PROCESS <|4:INCPDS|>('PDSName');
////*PROCESS <|5:INCPDS|>('PDSName2');

verify.expectDiagnosticsAt([1, 2, 4, 5], {
  message: code.CompilerOptions.MutexOptionIssue.message("INCPDS"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectCompilerOptions({
  incPds: {
    pds: ["PDSName", "PDSName2"],
  },
});
