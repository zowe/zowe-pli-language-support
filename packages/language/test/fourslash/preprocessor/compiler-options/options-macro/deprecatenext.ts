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
////*PROCESS PP(MACRO("DEPRECATENEXT(<|1:LOWER|>)"));
////*PROCESS PP(MACRO("DEPRECATENEXT(<|2:LOWER|>())"));
////*PROCESS PP(MACRO("DEPRECATENEXT(ENTRY(OLD1, OLD2))"));
////*PROCESS PP(MACRO("DEPRECATENEXT(ENTRY(OLD3, OLD4))"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedOption.message(""),
});
verify.expectDiagnosticsAt(2, {
  message:
    code.CompilerOptions.PPMacro.Deprecate.InvalidSubOption.message("LOWER"),
});

verify.expectCompilerOptions({
  macroOptions: {
    deprecateNext: ["OLD3", "OLD4"],
  },
});
