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
////*PROCESS <|2:BIFPREC|>;
////*PROCESS <|4:BIFPREC|>(<|5:)|>;
////*PROCESS <|6:BIFPREC|>(<|7:INVALID|>);
////*PROCESS <|8:BIFPREC|>(15);

verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("BIFPREC"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.BiFPrec.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  bifprec: 15,
});
