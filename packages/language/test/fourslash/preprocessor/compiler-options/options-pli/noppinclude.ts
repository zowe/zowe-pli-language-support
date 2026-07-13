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
////*PROCESS <|1:PPINCLUDE|>('ID(-inc)');
////*PROCESS <|2:NOPPINCLUDE|>;

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOPPINCLUDE"),
});
verify.expectCompilerOptions({
  ppInclude: false,
});
