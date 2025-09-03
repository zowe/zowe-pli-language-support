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
////*PROCESS <|1:STRINGOFGRAPHIC|>;
////*PROCESS <|2:STRINGOFGRAPHIC|>(<|3:)|>;
////*PROCESS <|4:CHAR|>(<|5:INVALID|>);
////*PROCESS <|6:G|>(CHARACTER);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.DupeOptionIssue.message("STRINGOFGRAPHIC"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.DupeOptionIssue.message("CHAR"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.DupeOptionIssue.message("G"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.StringOfGraphic.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  stringOfGraphic: "CHARACTER",
});
