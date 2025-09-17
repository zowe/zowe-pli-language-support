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
////*PROCESS NOMDECK;
////*PROCESS <|1:MDECK|>;
////*PROCESS <|2:MDECK|>(<|3:)|>;
////*PROCESS <|4:MDECK|>(<|5:INVALID|>);
////*PROCESS <|6:MDECK|>(<|7:AFTERALL|> AFTERMACRO);
////*PROCESS <|8:NMD|>;
////*PROCESS <|9:MD|>(AFTERMACRO, AFTERALL);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MDeck.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.MDeck.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics(7); // Verified.
verify.expectDiagnosticsAt([1, 2, 4, 6], {
  message: code.CompilerOptions.MutexOptionIssue.message("MDECK"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.DupeOptionIssue.message("NMD"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.MutexOptionIssue.message("MD"),
});
verify.expectCompilerOptions({
  mDeck: "AFTERALL",
});
