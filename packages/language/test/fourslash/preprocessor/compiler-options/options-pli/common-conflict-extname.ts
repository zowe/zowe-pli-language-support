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
////*PROCESS LIMITS(EXTNAME(80));
////*PROCESS <|1:COMMON|>;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Common.ConflictWithExtName.message(80),
});

verify.expectCompilerOptions({
  common: true,
  limits: {
    extname: 80,
  },
});
