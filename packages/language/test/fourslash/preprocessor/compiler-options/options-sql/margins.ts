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
////*PROCESS PP(SQL("MAR(<|1:72|>, 10)"));
////*PROCESS PP(SQL("MARGINS(2, 72, <|2:20|>)"));
////*PROCESS PP(SQL("MARGINS(10, 72, 80)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPSQL.Margins.InvalidMarginPosition.message(),
});
verify.expectDiagnosticsAt(2, {
  message:
    code.CompilerOptions.PPSQL.Margins.InvalidContinuationPosition.message(),
});

verify.expectCompilerOptions({
  sqlOptions: {
    margins: {
      m: 10,
      n: 72,
      c: 80,
    },
  },
});
