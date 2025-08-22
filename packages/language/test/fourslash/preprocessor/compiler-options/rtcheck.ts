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
////*PROCESS <|1:RTCHECK|>;
////*PROCESS <|2:RTCHECK|>(<|3:INVALID|>);
////*PROCESS <|4:RTCHECK|>(NULL370);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 4], {
  message: code.CompilerOptions.DupeOptionIssue.message("RTCHECK"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.RtCheck.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  rtCheck: "NULL370",
});
