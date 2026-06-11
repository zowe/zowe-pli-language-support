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
////*PROCESS RULES(PADDING(<|1:)|>);
////*PROCESS RULES(<|2:PADDING|>);
////*PROCESS RULES(<|3:NOPADDING|>);
////*PROCESS RULES(NOPADDING(<|4:)|>);
////*PROCESS RULES(NOPADDING(<|5:INVALID|>));
////*PROCESS RULES(NOPADDING(ALL LOOSE <|6:STRICT|> <|7:SOURCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidPaddingParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOPADDING(STRICT)"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOPADDING(SOURCE)"),
});
verify.expectCompilerOptions({
  rules: {
    padding: {
      source: constants.CompilerOptions.RulesSource.SOURCE,
      strict: constants.CompilerOptions.RulesStrict.STRICT,
    },
  },
});
