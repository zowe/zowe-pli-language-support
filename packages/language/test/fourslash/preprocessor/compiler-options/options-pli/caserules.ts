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
////*PROCESS <|1:CASERULES|>;
////*PROCESS <|2:CASERULES|>(<|3:)|>;
////*PROCESS <|4:CASERULES|>(<|5:INVALID|>);
////*PROCESS <|6:CASERULES|>(<|7:KEYWORD|>);
////*PROCESS <|8:CASERULES|>(<|9:INVALID|>());
////*PROCESS <|10:CASERULES|>(KEYWORD(<|11:)|>);
////*PROCESS <|12:CASERULES|>(KEYWORD(<|13:INVALID|>));
////*PROCESS <|14:CASERULES|>(keyWORD(MIXED), <|15:KEYWORD|>(UPPER));

verify.expectDiagnosticsAt([2, 4, 6, 8, 10, 12], {
  message: code.CompilerOptions.DupeOptionIssue.message("CASERULES"),
});
verify.expectDiagnosticsAt([3, 5, 7], {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.CaseRules.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(13, {
  message:
    code.CompilerOptions.CaseRules.InvalidKeywordParameter.message("INVALID"),
});
verify.noDiagnosticsExceptAt(14, [
  code.CompilerOptions.DupeOptionIssue.message("CASERULES"),
]);
verify.expectDiagnosticsAt(15, {
  message: code.CompilerOptions.DupeOptionIssue.message("CASERULES(KEYWORD)"),
});
verify.expectCompilerOptions({
  caserules: constants.CompilerOptions.CaseRules.UPPER,
});
