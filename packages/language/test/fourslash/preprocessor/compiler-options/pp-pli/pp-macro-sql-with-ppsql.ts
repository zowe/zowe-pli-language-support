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

// If you want to override the SQL options without invoking the SQL preprocessor twice,
// it is better not to specify the preprocessor options in the PP option, but rather to
// specify them through the PPSQL option: PP(MACRO SQL) PPSQL('CCSID0 DATE(ISO)').

// @wrap: process
////*PROCESS PP(MACRO SQL) PPSQL("CCSID0");

verify.noDiagnostics();
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
    ],
  },
  sqlOptions: {
    ccsid0: true,
  },
});
