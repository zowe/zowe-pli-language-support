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

/// <reference path="../../framework.ts" />

// @wrap: process
////*PROCESS <|1:LIMITS|>;
////*PROCESS <|dupe0:LIMITS|>(<|2:)|>;
////*PROCESS <|dupe1:LIMITS|>(<|3:INVALID|>);
////*PROCESS <|dupe2:LIMITS|>(<|4:INVALID|>());
////*PROCESS <|dupe3:LIMITS|>(FIXEDBIN(<|5:INVALID|>));
////*PROCESS <|dupe4:LIMITS|>(FIXEDDEC(<|6:INVALID|>));
////*PROCESS <|dupe5:LIMITS|>(NAME(<|7:INVALID|>));
////*PROCESS <|dupe6:LIMITS|>(STRING(<|8:INVALID|>));
////*PROCESS <|dupe7:LIMITS|>(EXTNAME(<|9:INVALID|>));
////*PROCESS <|dupe8:LIMITS|>(FIXEDBIN(<|10:30|>));
////*PROCESS <|dupe9:LIMITS|>(FIXEDBIN(31, <|11:31|>));
////*PROCESS <|dupe10:LIMITS|>(FIXEDDEC(<|12:30|>));
////*PROCESS <|dupe12:LIMITS|>(FIXEDDEC(15, <|13:30|>));
////*PROCESS <|dupe11:LIMITS|>(FIXEDDEC(<|14:31|>, 15));
////*PROCESS <|dupe13:LIMITS|>(NAME(<|15:3|>));
////*PROCESS <|dupe14:LIMITS|>(EXTNAME(<|16:3|>));
////*PROCESS <|dupe15:LIMITS|>(FIXEDBIN(31, 63));
////*PROCESS <|dupe16:LIMITS|>(FIXEDDEC(15, 15));
////*PROCESS <|dupe17:LIMITS|>(NAME(64));
////*PROCESS <|dupe18:LIMITS|>(EXTNAME(80));
////*PROCESS <|dupe19:LIMITS|>(STRING(32K));
////*PROCESS <|dupe20:LIMITS|>(STRING(512K));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.Limits.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt([5, 6, 7], {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.ExpectedNumber.message("INVALID"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.ExpectedNumber.message(),
});
verify.expectDiagnosticsAt(10, {
  message:
    code.CompilerOptions.Limits.InvalidFixedBinMinParameter.message("30"),
});
verify.expectDiagnosticsAt(11, {
  message:
    code.CompilerOptions.Limits.InvalidFixedBinMaxParameter.message("31"),
});
verify.expectDiagnosticsAt(12, {
  message:
    code.CompilerOptions.Limits.InvalidFixedDecMinParameter.message("30"),
});
verify.expectDiagnosticsAt(13, {
  message:
    code.CompilerOptions.Limits.InvalidFixedDecMaxParameter.message("30"),
});
verify.expectDiagnosticsAt(14, {
  message: code.CompilerOptions.Limits.InvalidFixedDecRange.message(),
});
verify.expectDiagnosticsAt(15, {
  message: code.CompilerOptions.ExpectedNumberRange.message("3", "31", "100"),
});
verify.expectDiagnosticsAt(16, {
  message: code.CompilerOptions.ExpectedNumberRange.message("3", "7", "100"),
});
// TODO ssmifi: In an upcoming revision, the LIMITS compiler option should not report dupes. (#321)
verify.expectDiagnosticsAt(
  Array.from({ length: 21 }, (_, i) => `dupe${i}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("LIMITS"),
  },
);
verify.expectCompilerOptions({
  limits: {
    fixedBin: {
      min: 31,
      max: 63,
    },
    fixedDec: {
      min: 15,
      max: 15,
    },
    name: 64,
    extname: 80,
    // TODO ssmifi: Note that the string sub-option also depends on BIFPREC and CMPAT (#322).
    // A check for compiler option dependencies should be added in the future.
    string: 512 * 1024,
  },
});
