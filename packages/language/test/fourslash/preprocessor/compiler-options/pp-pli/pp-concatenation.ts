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

// If you specify the PP option more than once, the compiler effectively concatenates
// them. So specifying PP(SQL) PP(CICS) is the same as specifying PP(SQL CICS).

// @wrap: process
////*PROCESS PP(SQL) PP(CICS);

verify.noDiagnostics();
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
      {
        name: constants.CompilerOptions.PPItemName.CICS,
      },
    ],
  },
});
