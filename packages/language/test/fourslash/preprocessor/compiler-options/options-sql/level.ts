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
////*PROCESS PP(SQL("L(REL100)"));
////*PROCESS PP(SQL("<|1:LEVEL|>(<|2:TOOLONGVALUE|>)"));

verify.expectDiagnosticsAt(2, {
  message:
    code.CompilerOptions.PPSQL.Level.InvalidParameter.message("TOOLONGVALUE"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("LEVEL"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    level: "REL100",
  },
});
