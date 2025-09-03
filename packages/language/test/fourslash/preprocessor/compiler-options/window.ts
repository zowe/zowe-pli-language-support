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

/// <reference path="../../framework.ts" />

// @wrap: process
////*PROCESS <|1:WINDOW|>;
////*PROCESS <|2:WINDOW|>(<|3:)|>;
////*PROCESS <|4:WINDOW|>(<|5:INVALID|>);
////*PROCESS <|6:WINDOW|>(2k);

verify.expectDiagnosticsAt([2, 4, 6], {
  message: code.CompilerOptions.DupeOptionIssue.message("WINDOW"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectCompilerOptions({
  window: 2 * 1024,
});
