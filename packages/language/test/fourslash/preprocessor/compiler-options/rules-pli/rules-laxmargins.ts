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
////*PROCESS RULES(LAXMARGINS(<|1:)|>);
////*PROCESS RULES(<|2:LAXMARGINS|>);
////*PROCESS RULES(<|3:NOLAXMARGINS|>);
////*PROCESS RULES(NOLAXMARGINS(<|4:)|>);
////*PROCESS RULES(NOLAXMARGINS(<|5:INVALID|>));
////*PROCESS RULES(NOLAXMARGINS(<|6:XNUMERIC|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3, 6]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidLaxMarginsParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rules: {
    laxMargins: constants.CompilerOptions.RulesMargins.XNUMERIC,
  },
});
