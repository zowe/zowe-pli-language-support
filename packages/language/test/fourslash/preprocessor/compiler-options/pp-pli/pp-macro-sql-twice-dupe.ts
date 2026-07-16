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

// If you specify PP(MACRO SQL('CCSID0')) and PP(MACRO SQL('CCSID0 DATE(ISO)')), the
// resulting PP option is PP(MACRO SQL('CCSID0') MACRO SQL('CCSID0 DATE(ISO)')), and both
// the MACRO and the SQL preprocessor will be invoked twice.

// @wrap: process
////*PROCESS PP(MACRO SQL("CCSID0")) PP(MACRO SQL("<|1:CCSID0|> DATE(ISO)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.DupeOptionIssue.message("CCSID0"),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
        value: "CCSID0",
      },
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
        value: "CCSID0 DATE(ISO)",
      },
    ],
  },
  sqlOptions: {
    ccsid0: true,
  },
});
