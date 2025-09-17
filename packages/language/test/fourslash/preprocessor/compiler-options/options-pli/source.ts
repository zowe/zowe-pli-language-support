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
////*PROCESS NOSOURCE;
////*PROCESS <|1:NS|>;
////*PROCESS <|2:SOURCE|>();
////*PROCESS <|3:S|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("NS"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("SOURCE"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("S"),
});
verify.expectCompilerOptions({
  source: true,
});
