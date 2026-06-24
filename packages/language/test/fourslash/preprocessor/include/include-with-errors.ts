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

/// <reference path="../../framework.ts" />

// @filename: cpy/lib.pli
//// this makes no sense!!! I am not even a valid PLI file :-(

// @filename: cpy/including.pli
//// %INCLUDE <|1:"lib.pli"|>;

verify.expectDiagnosticsAt("1", [
  {
    severity: 2,
    message: "Included file './cpy/lib.pli' contains 4 errors.",
  },
]);
