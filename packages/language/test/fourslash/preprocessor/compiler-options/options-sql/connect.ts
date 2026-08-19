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
////*PROCESS PP(SQL("CT(1)"));
////*PROCESS PP(SQL("<|1:CONNECT|>(<|2:3|>)"));

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedNumberRange.message(3, 1, 2),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("CONNECT"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    connect: 1,
  },
});
