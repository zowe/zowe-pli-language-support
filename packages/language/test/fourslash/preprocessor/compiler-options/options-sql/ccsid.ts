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
////*PROCESS PP(SQL("CCSID(1208)"));
////*PROCESS PP(SQL("CCSID(<|1:70000|>)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedNumberRange.message(70000, 1, 65535),
});

verify.expectCompilerOptions({
  sqlOptions: {
    ccsid: 1208,
  },
});
