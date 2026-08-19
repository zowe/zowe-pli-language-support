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
////*PROCESS PP(SQL("TIME(JIS)"));
////*PROCESS PP(SQL("TIME(<|1:INVALID|>)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPSQL.Time.InvalidParameter.message("INVALID"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    time: constants.CompilerOptions.SQL.Time.JIS,
  },
});
