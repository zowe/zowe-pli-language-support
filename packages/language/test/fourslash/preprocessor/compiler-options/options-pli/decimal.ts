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
////*PROCESS <|2:DECIMAL|>;
////*PROCESS <|4:DECIMAL|>(<|5:)|>;
////*PROCESS <|6:DECIMAL|>(<|7:INVALID|>);
////*PROCESS <|8:DEC|>(NOFOFLONASGN, , CHECKFLOAT);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt([4, 6], {
  message: code.CompilerOptions.DupeOptionIssue.message("DECIMAL"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.DupeOptionIssue.message("DEC"),
});

verify.noDiagnostics(5);
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Decimal.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  decimal: {
    foflonasgn: false,
    checkfloat: true,
  },
});
