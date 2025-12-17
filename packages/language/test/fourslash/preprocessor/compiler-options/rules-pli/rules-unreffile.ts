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
////*PROCESS RULES(<|2:UNREFFILE|>);
////*PROCESS RULES(<|3:NOUNREFFILE|>);
////*PROCESS RULES(NOUNREFFILE(<|4:)|>);
////*PROCESS RULES(NOUNREFFILE(<|5:INVALID|>));
////*PROCESS RULES(NOUNREFFILE(<|6:SOURCE|>));

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
    unrefFile: constants.CompilerOptions.RulesSource.SOURCE,
  },
});
