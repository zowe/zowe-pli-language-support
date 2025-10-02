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
////*PROCESS <|2:OR|>;
////*PROCESS <|4:OR|>(<|5:)|>;
////*PROCESS <|6:OR|>(<|7:INVALID|>);
////*PROCESS <|8:OR|>(<|9:'##'|>);
////*PROCESS <|10:OR|>(<|11:'z'|>);
////*PROCESS <|12:OR|>(<|13:'|'|>);
////*PROCESS <|14:OR|>('$');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8, 10, 12, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("OR"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Or.InvalidParameterLength.message("##"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Or.InvalidParameterCharacter.message("z"),
});
verify.noDiagnostics(13);
verify.expectCompilerOptions({
  or: "$",
});
