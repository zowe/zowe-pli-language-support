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
////*PROCESS MARGINS(4, 80);
////*PROCESS <|2:MARGINS|>(<|3:m|>, 80);
////*PROCESS <|4:MARGINS|>(2, <|5:n|>);
////*PROCESS <|6:MARGINS|>(2, 72, <|7:c|>);
////*PROCESS <|8:MARGINS|>(<|9:101|>, 80);
////*PROCESS <|10:MARGINS|>(4, <|11:201|>);

verify.expectDiagnosticsAt([2, 4, 6, 8, 10], {
  message: code.CompilerOptions.DupeOptionIssue.message("MARGINS"),
});
verify.expectDiagnosticsAt([3, 5, 7], {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumberRange.message(101, 1, 100),
});
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.ExpectedNumberRange.message(201, 1, 200),
});
verify.expectCompilerOptions({
  margins: {
    // Fallback to defaults.
    m: 2,
    n: 72,
  },
});
