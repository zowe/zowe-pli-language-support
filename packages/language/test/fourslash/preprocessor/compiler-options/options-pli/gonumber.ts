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
////*PROCESS GONUMBER(SEPARATE);
////*PROCESS GONUMBER(<|1:Nxx|>);
////*PROCESS <|2:NOGONUMBER|>(SEPARATE);
////*PROCESS <|3:GONUMBER|>(NOSEPARATE);
////*PROCESS <|4:NOGONUMBER|>;
////*PROCESS <|5:GN|>(NOSEPARATE);
////*PROCESS <|6:NGN|>;
////*PROCESS <|9:GONUMBER|>;
////*PROCESS <|7:GN|>(<|8:separate|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.GoNumber.InvalidParameter.message("Nxx"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(1, 0, 0),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.DupeOptionIssue.message("GONUMBER"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOGONUMBER"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.DupeOptionIssue.message("GN"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.MutexOptionIssue.message("NGN"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.DupeOptionIssue.message("GN"),
});
verify.noDiagnostics(8);
// The compiler defaults to GONUMBER(NOSEPARATE) if no argument is provided, so 0 parameters are fine
verify.noDiagnostics(9, code.CompilerOptions.InvalidParameterCount);
verify.expectCompilerOptions({
  goNumber: {
    separate: true,
  },
});
