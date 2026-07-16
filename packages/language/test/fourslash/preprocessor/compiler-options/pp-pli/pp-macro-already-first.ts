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

// Specifying MACRO and PP(MACRO SQL) leaves the PP option unchanged, since MACRO is
// already first in the list, and no diagnostic is reported.

////*PROCESS MACRO PP(MACRO SQL);

verify.noDiagnostics();
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
    ],
  },
});
