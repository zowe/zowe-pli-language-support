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
////*PROCESS <|1:CHECK|>;
////*PROCESS <|2:CHECK|>(<|3:)|>;
////*PROCESS <|4:CHECK|>(<|5:INVALID|>);
////*PROCESS <|6:CHECK|>(STORAGE);
////*PROCESS <|8:CHECK|>(STORAGE, <|9:STG|>);
////*PROCESS <|10:CHECK|>(STORAGE NSTG);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("CHECK"),
});
verify.noDiagnostics(3);
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Check.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.DupeOptionIssue.message("CHECK(STG)"),
});
verify.expectCompilerOptions({
  check: { storage: constants.CompilerOptions.CheckStorage.NOSTORAGE },
});
