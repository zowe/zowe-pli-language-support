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
////*PROCESS PP(CICS("LINECOUNT(<|1:INVALID|>)"));
////*PROCESS PP(CICS("LINECOUNT(<|2:0|>)"));
////*PROCESS PP(CICS("LC(120)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedNumberRange.message(0, 1, 255),
});

verify.expectCompilerOptions({
  cicsOptions: {
    lineCount: 120,
  },
});
