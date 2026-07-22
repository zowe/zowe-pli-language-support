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

// Specifying MACRO and PP(CICS MACRO) causes PP to become PP(MACRO CICS MACRO), with a
// diagnostic reported at the first PP item (CICS), since MACRO was implicitly added.

// @wrap: process
////*PROCESS MACRO PP(<|1:CICS|> MACRO);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.MacroImplicitlyAdded.message(),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.CICS,
      },
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
    ],
  },
});
