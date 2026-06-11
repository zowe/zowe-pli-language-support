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
////*PROCESS RULES(LAXINOUT(<|1:)|>);
////*PROCESS RULES(<|2:LAXINOUT|>);
////*PROCESS RULES(<|3:NOLAXINOUT|>);
////*PROCESS RULES(NOLAXINOUT(<|4:)|>);
////*PROCESS RULES(NOLAXINOUT(<|5:INVALID|>));
////*PROCESS RULES(NOLAXINOUT(ALL LOOSE <|6:STRICT|> <|7:SOURCE|> <|8:STRICT|> <|9:LOOSE|> <|10:STRICT|> <|11:ALL|> <|12:SOURCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidLaxInOutParameter.message("INVALID"),
});
verify.expectDiagnosticsAt([6, 8, 10], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOLAXINOUT(STRICT)"),
});
verify.expectDiagnosticsAt([7, 12], {
  message: code.CompilerOptions.MutexOptionIssue.message("NOLAXINOUT(SOURCE)"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOLAXINOUT(LOOSE)"),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.DupeOptionIssue.message("NOLAXINOUT(ALL)"),
});
verify.expectCompilerOptions({
  rules: {
    laxInOut: {
      source: constants.CompilerOptions.RulesSource.SOURCE,
      strict: constants.CompilerOptions.RulesStrict.STRICT,
    },
  },
});
