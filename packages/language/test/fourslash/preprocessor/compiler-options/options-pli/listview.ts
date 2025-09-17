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
////*PROCESS <|1:LISTVIEW|>;
////*PROCESS <|2:LISTVIEW|>(<|3:)|>;
////*PROCESS <|4:LISTVIEW|>(<|5:INVALID|>);
////*PROCESS <|6:LISTVIEW|>(<|7:SOURCE|> AFTERSQL);
////*PROCESS <|8:LISTVIEW|>(SOURCE, AFTERALL);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ListView.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ListView.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics(7); // Verified.
verify.expectDiagnosticsAt([2, 4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("LISTVIEW"),
});
verify.expectCompilerOptions({
  listView: "AFTERALL",
});
