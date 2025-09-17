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
////*PROCESS <|2:QUOTE|>;
////*PROCESS <|4:QUOTE|>(<|5:)|>;
////*PROCESS <|6:QUOTE|>(<|7:INVALID|>);
////*PROCESS <|8:QUOTE|>(<|9:'##'|>);
////*PROCESS <|10:QUOTE|>(<|11:'z'|>);
////*PROCESS <|12:QUOTE|>('$');

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
// verify.expectDiagnosticsAt([4, 6, 8, 10, 12], {
//   message: code.CompilerOptions.DupeOptionIssue.message("QUOTE"),
// });
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Quote.InvalidParameterLength.message("##"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.Quote.InvalidParameterCharacter.message("z"),
});
verify.expectCompilerOptions({
  quote: "$",
});
