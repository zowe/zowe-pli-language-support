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
////*PROCESS PP(CICS("MARGINS(<|1:80|>, 4)"));
////*PROCESS PP(CICS("MARGINS(2, 80, <|2:10|>)"));
////*PROCESS PP(CICS("MAR(10, 90, 0)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPCICS.Margins.InvalidMarginPosition.message(),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.PPCICS.Margins.InvalidAnsPosition.message(),
});

verify.expectCompilerOptions({
  cicsOptions: {
    margins: {
      m: 10,
      n: 90,
      c: 0,
    },
  },
});
