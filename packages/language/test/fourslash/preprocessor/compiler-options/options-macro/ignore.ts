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
////*PROCESS PP(MACRO("<|1:NOIGNORE|>"));
////*PROCESS PP(MACRO("<|2:IGNORE|>"));
////*PROCESS PP(MACRO("IGNORE(<|3:)|>"));
////*PROCESS PP(MACRO("IGNORE(<|4:LOWER|>)"));
////*PROCESS PP(MACRO("IGNORE(<|5:NOPRINT|>)"));

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("IGNORE"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.PPMacro.Ignore.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(4, {
  message:
    code.CompilerOptions.PPMacro.Ignore.InvalidParameter.message("LOWER"),
});
verify.noDiagnostics(5);

verify.expectCompilerOptions({
  macroOptions: {
    ignore: {
      noprint: true,
    },
  },
});
