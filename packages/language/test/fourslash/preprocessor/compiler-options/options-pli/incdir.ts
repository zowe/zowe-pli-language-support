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
////*PROCESS NOINCDIR;
////*PROCESS <|1:INCDIR|>(<|2:)|>;
////*PROCESS <|3:INCDIR|>(<|4:NoString|>);
////*PROCESS <|5:INCDIR|>('lib');
////*PROCESS <|6:INCDIR|>('lib2');

verify.expectDiagnosticsAt([1, 3, 5, 6], {
  message: code.CompilerOptions.MutexOptionIssue.message("INCDIR"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.expectCompilerOptions({
  incDir: {
    directories: ["lib", "lib2"],
  },
});
