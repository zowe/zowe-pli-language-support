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
////*PROCESS LP(64);
////*PROCESS PP(SQL("HOSTCOPY"));

verify.noDiagnostics();

verify.expectCompilerOptions({
  LP: constants.CompilerOptions.LP.LP64,
  sqlOptions: {
    hostCopy: true,
  },
});
