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
////*PROCESS HEADER(ALL);
////*PROCESS <|1:HEADER|>(FILE);
////*PROCESS <|2:HEADER|>(FIRST);
////*PROCESS <|3:HEADER|>(SOURCE);
////*PROCESS HEADER(<|4:INVALID|>);
////*PROCESS HEADER(<|5:)|>;
////*PROCESS <|6:HEADER|>;

verify.expectDiagnosticsAt([1, 2, 3], {
  message: code.CompilerOptions.DupeOptionIssue.message("HEADER"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.Header.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Header.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectCompilerOptions({
  header: "SOURCE",
});
