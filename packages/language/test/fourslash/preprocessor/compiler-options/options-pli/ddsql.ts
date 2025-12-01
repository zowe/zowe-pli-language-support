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
////*PROCESS <|2:DDSQL|>;
////*PROCESS <|4:DDSQL|>(<|5:)|>;
////*PROCESS <|6:DDSQL|>(<|7:''|>);
////*PROCESS <|8:DDSQL|>('dataset');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("DDSQL"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.DDSQL.InvalidParameter.message(),
});
verify.noDiagnostics(7);
verify.expectCompilerOptions({
  ddsql: "dataset",
});
