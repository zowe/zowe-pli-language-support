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
////*PROCESS PP(SQL("<|1:GRAPHIC|>"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPSQL.Graphic.SupersededByCcsid.message(),
});

verify.expectCompilerOptions({
  sqlOptions: {
    graphic: true,
    ccsid: 1208,
  },
});
