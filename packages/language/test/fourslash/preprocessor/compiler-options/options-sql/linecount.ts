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
////*PROCESS PP(SQL("LC(40)"));
////*PROCESS PP(SQL("<|1:LINECOUNT|>(<|2:-5|>)"));

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedNumberRange.message(-5, 0, undefined),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("LINECOUNT"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    lineCount: 40,
  },
});
