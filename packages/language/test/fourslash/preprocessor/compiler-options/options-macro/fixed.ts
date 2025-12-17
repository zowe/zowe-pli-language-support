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
////*PROCESS PP(MACRO("FIXED(<|1:LOWER|>)"));
////*PROCESS PP(MACRO("FIXED(BINARY)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPMacro.Fixed.InvalidParameter.message("LOWER"),
});

verify.expectCompilerOptions({
  macroOptions: {
    fixed: constants.CompilerOptions.Macro.Fixed.BINARY,
  },
});
