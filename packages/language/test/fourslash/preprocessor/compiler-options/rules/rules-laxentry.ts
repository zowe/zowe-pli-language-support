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
////*PROCESS RULES(LAXENTRY(<|1:)|>);
////*PROCESS RULES(<|2:LAXENTRY|>);
////*PROCESS RULES(<|3:NOLAXENTRY|>);
////*PROCESS RULES(NOLAXENTRY(<|4:)|>);
////*PROCESS RULES(NOLAXENTRY(<|5:INVALID|>));
////*PROCESS RULES(NOLAXENTRY(<|6:LOOSE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3, 6]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidLaxEntryParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rules: {
    laxEntry: "LOOSE",
  },
});
