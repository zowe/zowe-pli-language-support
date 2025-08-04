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
////*PROCESS GRAPHIC;
////*PROCESS <|1:NOGRAPHIC|>;
////*PROCESS <|2:NGR|>;
////*PROCESS <|3:GR|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOGRAPHIC"),
});

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("NGR"),
});

verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.DupeOptionIssue.message("GR"),
});

verify.noDiagnosticsExcept([
  new RegExp(code.CompilerOptions.DupeOptionIssue.message("").substring(0, 20)),
  new RegExp(
    code.CompilerOptions.MutexOptionIssue.message("").substring(0, 20),
  ),
]);

verify.expectCompilerOptions({
  graphic: true,
});
