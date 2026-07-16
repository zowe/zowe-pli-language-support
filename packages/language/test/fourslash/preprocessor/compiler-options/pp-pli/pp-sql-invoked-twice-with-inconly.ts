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

// The SQL preprocessor can be invoked twice, since the first invocation specifies
// INCONLY as its option.

// @wrap: process
////*PROCESS PP(SQL("INCONLY") SQL);

verify.noDiagnostics();
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.SQL,
        value: "INCONLY",
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
    ],
  },
});
