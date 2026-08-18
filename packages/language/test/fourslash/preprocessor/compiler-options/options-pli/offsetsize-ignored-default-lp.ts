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
////*PROCESS <|1:OFFSETSIZE|>(8);

// LP is never specified here, so its default value of LP(32) applies, which
// still causes OFFSETSIZE to be ignored.
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.OffsetSize.IgnoredWithLp32.message(),
});

verify.expectCompilerOptions({
  LP: constants.CompilerOptions.LP.LP32,
  offsetSize: 8,
});
