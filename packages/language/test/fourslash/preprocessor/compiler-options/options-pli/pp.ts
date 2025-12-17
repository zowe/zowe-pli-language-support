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
////*PROCESS <|1:NOPP|>;
////*PROCESS <|2:PP|>;
////*PROCESS <|4:PP|>(<|3:)|>;
////*PROCESS <|6:PP|>(<|5:INVALID|>);
////*PROCESS <|8:PP|>(<|7:"MACRO"|>);
////*PROCESS <|10:PP|>(MACRO(<|9:X|>));
////*PROCESS <|12:PP|>(<|11:MACRO|>("X", "Z">));
////*PROCESS <|14:PP|>(MACRO, SQL, CICS);

verify.noDiagnostics(1);
// TODO ssmifi: Should actually not report a dupe/mutex warning in the future.
verify.expectDiagnosticsAt([4, 6, 8], {
  message: code.CompilerOptions.MutexOptionIssue.message("PP"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.PP.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.PP.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.PP.InvalidParameterType.message(),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedString.message(),
});
// TODO ssmifi: Actually, calling the PP with an invalid options aborts the compilation on the mainframe.
// Must be checked and the test adjusted for #397.
verify.expectDiagnosticsAt(11, {
  message: code.CompilerOptions.PP.InvalidOptionParameter.message("MACRO", 2),
});
verify.expectCompilerOptions({
  pp: {
    items: [
      {
        name: constants.CompilerOptions.PPItemName.MACRO,
      },
      {
        name: constants.CompilerOptions.PPItemName.SQL,
      },
      {
        name: constants.CompilerOptions.PPItemName.CICS,
      },
    ],
  },
});
