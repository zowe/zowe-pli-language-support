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

// The MACRO option is added to the beginning of the PP option's preprocessor list even
// when MACRO and PP(...) are specified in entirely separate *PROCESS directives, and even
// when the directive that finally sets MACRO doesn't specify PP(...) at all.

// @wrap: process
////*PROCESS PP(<|1:SQL|>);
////*PROCESS PP(CICS);
////*PROCESS MACRO;

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.MacroImplicitlyAdded.message(),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      { name: constants.CompilerOptions.PPItemName.MACRO },
      { name: constants.CompilerOptions.PPItemName.SQL },
      { name: constants.CompilerOptions.PPItemName.CICS },
    ],
  },
});
