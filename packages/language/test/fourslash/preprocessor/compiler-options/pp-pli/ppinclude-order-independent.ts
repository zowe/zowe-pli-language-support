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

// The PPINCLUDE/PP(INCLUDE) validation looks at the final, fully-merged compiler
// options, so it doesn't matter which *PROCESS directive PP(INCLUDE) appears in
// relative to PPINCLUDE.

// @wrap: process
////*PROCESS <|1:PPINCLUDE('ID(-inc)');|>
////*PROCESS PP(INCLUDE);

verify.noDiagnostics(1);
verify.expectCompilerOptions({
  ppInclude: { value: "ID(-inc)" },
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.INCLUDE,
      },
    ],
  },
});
