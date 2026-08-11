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
////*PROCESS NOOBJECT;
////*PROCESS <|1:LIST|>;
////*PROCESS <|2:MAP|>;
////*PROCESS <|3:OFFSET|>;
////*PROCESS <|4:STORAGE|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Object.IgnoredOption.message("LIST"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Object.IgnoredOption.message("MAP"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Object.IgnoredOption.message("OFFSET"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.Object.IgnoredOption.message("STORAGE"),
});

verify.expectCompilerOptions({
  object: false,
  list: true,
  map: true,
  offset: true,
  storage: true,
});
