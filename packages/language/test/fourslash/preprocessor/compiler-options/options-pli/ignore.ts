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
////*PROCESS NOIGNORE;
////*PROCESS IGNORE();
////*PROCESS IGNORE(<|1:INVALID|>);
////*PROCESS IGNORE(ASSERT, DISPLAY, <|2:INVALID|>);
////*PROCESS <|3:IGNORE|>(ASSERT, PUT);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Ignore.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Ignore.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.MutexOptionIssue.message("IGNORE"),
});
verify.expectCompilerOptions({
  ignore: {
    items: [
      constants.CompilerOptions.IgnoreItem.ASSERT,
      constants.CompilerOptions.IgnoreItem.PUT,
    ],
  },
});
