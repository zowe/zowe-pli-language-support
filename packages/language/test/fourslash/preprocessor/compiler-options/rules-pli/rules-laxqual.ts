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
////*PROCESS RULES(LAXQUAL(<|1:)|>);
////*PROCESS RULES(<|2:LAXQUAL|>);
////*PROCESS RULES(<|3:NOLAXQUAL|>);
////*PROCESS RULES(NOLAXQUAL(<|4:)|>);
////*PROCESS RULES(NOLAXQUAL(<|5:INVALID|>));
////*PROCESS RULES(NOLAXQUAL(ALL LOOSE FULL <|6:STRICT|> <|7:FORCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidLaxQualParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOLAXQUAL(STRICT)"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.MutexOptionIssue.message("NOLAXQUAL(FORCE)"),
});
verify.expectCompilerOptions({
  rules: {
    laxQual: {
      source: constants.CompilerOptions.RulesQualSource.FORCE,
      strict: constants.CompilerOptions.RulesQualStrict.STRICT,
    },
  },
});
