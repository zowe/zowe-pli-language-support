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
////*PROCESS RULES(NOLAXINOUT(ALL LOOSE STRICT <|6:SOURCE|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.noDiagnostics([2, 3, 6]);
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.Rules.InvalidLaxInOutParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rules: {
    laxInOut: {
      source: constants.CompilerOptions.RulesSource.SOURCE,
      strict: constants.CompilerOptions.RulesStrict.STRICT,
    },
  },
});
