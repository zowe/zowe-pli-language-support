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
////*PROCESS PP(MACRO("DBCS(<|1:LOWER|>)"));
////*PROCESS PP(MACRO("DBCS(EXACT)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPMacro.Dbcs.InvalidParameter.message("LOWER"),
});

verify.expectCompilerOptions({
  macroOptions: {
    dbcs: constants.CompilerOptions.Macro.Dbcs.EXACT,
  },
});
