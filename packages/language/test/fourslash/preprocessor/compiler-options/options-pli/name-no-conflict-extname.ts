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
////*PROCESS LIMITS(EXTNAME(9));
////*PROCESS NAME('123456789');

// EXTNAME(9) is greater than 8, so the NAME length restriction does not apply.
verify.noDiagnostics();

verify.expectCompilerOptions({
  name: "123456789",
  limits: {
    extname: 9,
  },
});
