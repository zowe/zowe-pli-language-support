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
////*PROCESS PP(CICS("OPMARGINS(<|1:90|>, 4)"));
////*PROCESS PP(CICS("OM(4, 72, 0)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedNumberRange.message(90, 1, 80),
});

verify.expectCompilerOptions({
  cicsOptions: {
    opMargins: {
      m: 4,
      n: 72,
      c: 0,
    },
  },
});
