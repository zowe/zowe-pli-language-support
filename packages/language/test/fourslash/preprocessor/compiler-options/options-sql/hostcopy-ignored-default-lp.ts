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
////*PROCESS PP(SQL("<|1:HOSTCOPY|>"));

// LP is never specified here, so its default value of LP(32) applies, which
// still causes HOSTCOPY to be ignored.
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPSQL.HostCopy.IgnoredWithLp32.message(),
});

verify.expectCompilerOptions({
  LP: constants.CompilerOptions.LP.LP32,
  sqlOptions: {
    hostCopy: true,
  },
});
