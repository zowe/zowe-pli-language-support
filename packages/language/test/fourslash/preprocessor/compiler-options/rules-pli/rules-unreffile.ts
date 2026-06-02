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
////*PROCESS RULES(UNREFFILE(<|1:)|>);
////*PROCESS RULES(<|2:UNREFDEFFILE|>);
////*PROCESS RULES(<|3:NOUNREFDEFFILE|>);
////*PROCESS RULES(NOUNREFDEFFILE(<|4:)|>);
////*PROCESS RULES(NOUNREFDEFFILE(<|5:INVALID|>));
////*PROCESS RULES(NOUNREFDEFFILE(<|6:SOURCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3, 6]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.ExpectAllSourceParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rules: {
    unrefDefFile: constants.CompilerOptions.RulesSource.SOURCE,
  },
});
