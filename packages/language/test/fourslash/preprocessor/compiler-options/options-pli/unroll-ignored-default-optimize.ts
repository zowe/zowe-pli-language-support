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
////*PROCESS <|1:UNROLL|>(AUTO);

// OPTIMIZE is never specified here, so its default value of NOOPTIMIZE (0)
// applies, which still causes UNROLL to be ignored.
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Unroll.IgnoredWithNoOptimize.message(),
});

verify.expectCompilerOptions({
  optimize: 0,
  unroll: constants.CompilerOptions.Unroll.AUTO,
});
