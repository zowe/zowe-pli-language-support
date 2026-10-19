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
////*PROCESS LINEDIR;
////*PROCESS <|1:TEST|>(SEPARATE);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Test.ConflictWithLineDir.message(),
});

verify.expectCompilerOptions({
  lineDir: true,
  test: {
    separate: true,
  },
});
