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
////*PROCESS <|1:NAME|>('123456789');

// LIMITS(EXTNAME(n)) is never specified here, so its default value of 7
// applies, which is <= 8, so the NAME length restriction still applies.
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Name.TooLongForExtName.message("123456789", 7),
});

verify.expectCompilerOptions({
  name: "123456789",
  limits: {
    extname: 7,
  },
});
