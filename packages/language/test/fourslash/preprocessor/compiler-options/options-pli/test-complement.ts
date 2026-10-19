/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS <|1:TEST|>(ALL HOOK SEPARATE NOSEPNAME SOURCE NOSYM);

verify.noDiagnostics(1);
verify.expectCompilerOptions({
  test: {
    level: constants.CompilerOptions.TestLevel.ALL,
    hook: true,
    separate: true,
    sepName: false,
    source: true,
    sym: false,
  },
});
