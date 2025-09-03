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

/// <reference path="../../framework.ts" />

// @wrap: process
////*PROCESS <|1:NOXREF|>;
////*PROCESS <|2:NX|>();
////*PROCESS <|4:XREF|>;
////*PROCESS <|6:XREF|>();
////*PROCESS <|8:XREF|>(<|9:INVALID|>);
////*PROCESS <|10:X|>(FULL SHORT IMPLICIT EXPLICIT);

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("NX"),
});
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.MutexOptionIssue.message("XREF"),
});
verify.expectDiagnosticsAt(10, {
  message: code.CompilerOptions.MutexOptionIssue.message("X"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.XRef.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  xRef: {
    length: "SHORT",
    structure: "EXPLICIT",
  },
});
