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
////*PROCESS RULES(COMPLEX(<|1:)|>);
////*PROCESS RULES(<|2:COMPLEX|>, <|3:NOCOMPLEX|>);
////*PROCESS RULES(NOCOMPLEX(<|4:)|>);
////*PROCESS RULES(NOCOMPLEX(<|5:INVALID|>));
////*PROCESS RULES(NOCOMPLEX(<|6:SOURCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 6]);
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("RULES(NOCOMPLEX)"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.ExpectAllSourceParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rules: {
    complex: constants.CompilerOptions.RulesSource.SOURCE,
  },
});
