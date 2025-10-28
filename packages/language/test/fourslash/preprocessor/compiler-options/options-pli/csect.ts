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
////*PROCESS NOCSECT;
////*PROCESS <|1:CSECT|>;
////*PROCESS <|2:NOCSE|>;
////*PROCESS <|3:CSE|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.MutexOptionIssue.message("CSECT"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOCSE"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("CSE"),
});
verify.expectCompilerOptions({
  csect: true,
});
