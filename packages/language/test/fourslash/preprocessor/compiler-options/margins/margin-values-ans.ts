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
////*PROCESS MARGINS(2, 80, <|1:)|>;
////*PROCESS MARGINS(2, 80, <|2:10|>);
////*PROCESS MARGINS(2, 80, <|3:201|>);
////*PROCESS MARGINS(2, 80, <|4:0|>);
////*PROCESS MARGINS(2, 80, <|5:100|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Margins.InvalidAnsPosition.message(),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedNumberRange.message(201, 0, 200),
});
verify.noDiagnostics([4, 5]);
verify.expectCompilerOptions({
  margins: {
    m: 2,
    n: 80,
    c: 100,
  },
});
