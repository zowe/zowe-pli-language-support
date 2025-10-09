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
////*PROCESS <|1:INCAFTER|>;
////*PROCESS <|2:INCAFTER|>(<|3:)|>;
////*PROCESS <|4:INCAFTER|>(<|5:lib|>);
////*PROCESS <|6:INCAFTER|>(<|7:process|>);
////*PROCESS <|8:INCAFTER|>(process(<|9:)|>);
////*PROCESS <|10:INCAFTER|>(<|11:macro|>());
////*PROCESS <|12:INCAFTER|>(PROCESS(lib));

verify.noDiagnostics([1, 3]);
verify.expectDiagnosticsAt([2, 4, 6, 8, 10, 12], {
  message: code.CompilerOptions.DupeOptionIssue.message("INCAFTER"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.IncAfter.InvalidParameter.message("lib"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.IncAfter.InvalidParameter.message("process"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.IncAfter.InvalidParameter.message("macro"),
});
verify.expectCompilerOptions({
  incAfter: {
    // TODO ssmifi: Should this be converted to uppercase automatically?
    process: "lib",
  },
});
