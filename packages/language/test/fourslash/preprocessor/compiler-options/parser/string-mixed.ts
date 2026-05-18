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
////*PROCESS COPYRIGHT('Code /* by author */ v1.0');
////*PROCESS <|1:COPYRIGHT|>("URL: https://example.com");
////*PROCESS <|2:COPYRIGHT|>('Version; Release');
////*PROCESS <|3:COPYRIGHT|>("Quote: '");
////*PROCESS <|4:COPYRIGHT|>('Escaped: ''');
////*PROCESS <|5:COPYRIGHT|>('Ready /* with */ //;');

verify.expectDiagnosticsAt([1, 2, 3, 4, 5], {
  message: code.CompilerOptions.DupeOptionIssue.message("COPYRIGHT"),
});
verify.noDiagnosticsExcept([
  code.CompilerOptions.DupeOptionIssue.message("COPYRIGHT"),
]);
verify.expectCompilerOptions({
  copyright: "Ready /* with */ //;",
});
