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
////*PROCESS NOSTORAGE;
////*PROCESS <|1:NSTG|>;
////*PROCESS <|2:STORAGE|>();
////*PROCESS <|3:STG|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("NSTG"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("STORAGE"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("STG"),
});
verify.expectCompilerOptions({
  storage: true,
});
