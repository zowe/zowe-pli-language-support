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
////*PROCESS PP(SQL("SQLLEVEL(V12R1M100)"));
////*PROCESS PP(SQL("<|1:SQLLEVEL|>(<|2:INVALID|>)"));

verify.expectDiagnosticsAt(2, {
  message:
    code.CompilerOptions.PPSQL.SqlLevel.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("SQLLEVEL"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    sqlLevel: "V12R1M100",
  },
});
