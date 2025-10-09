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
////*PROCESS <|1:LANGLVL|>;
////*PROCESS <|2:LANGLVL|>(<|3:)|>;
////*PROCESS <|4:LANGLVL|>(<|5:INVALID|>);
////*PROCESS <|6:LANGLVL|>(<|7:'OS'|>, NOEXT);
////*PROCESS <|8:LANGLVL|>(OS, NOEXT);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt([2, 4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("LANGLVL"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.LangLvl.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.LangLvl.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.ExpectedPlain.message(),
});
verify.expectCompilerOptions({
  langlvl: "NOEXT",
});
