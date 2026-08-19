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
////*PROCESS PP(SQL("DATE(EUR)"));
////*PROCESS PP(SQL("DATE(<|1:INVALID|>)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPSQL.Date.InvalidParameter.message("INVALID"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    date: constants.CompilerOptions.SQL.Date.EUR,
  },
});
