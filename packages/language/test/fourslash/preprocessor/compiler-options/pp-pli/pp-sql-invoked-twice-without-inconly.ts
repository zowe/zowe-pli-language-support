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

// The SQL preprocessor can only be invoked twice if the first invocation specifies
// INCONLY as its option. Since neither invocation here specifies INCONLY, the second
// invocation is reported as invalid.

// @wrap: process
////*PROCESS PP(SQL <|1:SQL|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.SqlSecondInvocationRequiresIncOnly.message(),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
    ],
  },
});
