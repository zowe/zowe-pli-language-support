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
////*PROCESS DEFAULT(<|1:INITFILL|>);
////*PROCESS DEFAULT(INITFILL(<|2:)|>);
////*PROCESS DEFAULT(INITFILL(<|3:INVALID|>));
////*PROCESS DEFAULT(INITFILL(<|4:ffx|>));

verify.noDiagnostics(1, code.CompilerOptions.ExpectedOption);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(3, {
  message:
    code.CompilerOptions.Default.InvalidInitFillParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  default: {
    initfill: "FFX",
  },
});
