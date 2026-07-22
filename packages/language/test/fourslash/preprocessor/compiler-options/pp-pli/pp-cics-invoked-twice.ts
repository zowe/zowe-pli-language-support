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

// The CICS preprocessor must be invoked at most once.

// @wrap: process
////*PROCESS PP(CICS <|1:CICS|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.CicsInvokedMoreThanOnce.message(),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.CICS,
      },
      {
        name: constants.CompilerOptions.PPItemName.CICS,
      },
    ],
  },
});
