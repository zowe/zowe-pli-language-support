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

// PPINCLUDE('ID(-inc)') is overridden by the alt-keyword specified via
// PP(INCLUDE('ID(++include)')).

// @wrap: process
////*PROCESS PPINCLUDE(<|1:'ID(-inc)'|>) PP(INCLUDE('ID(++include)'));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PPInclude.OverriddenByPPInclude.message(),
});
verify.expectCompilerOptions({
  ppInclude: { value: "ID(-inc)" },
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.INCLUDE,
        value: "ID(++include)",
      },
    ],
    ppInclude: { value: "++INCLUDE" },
  },
});
