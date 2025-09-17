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
////*PROCESS <|1:PREFIX|>;
////*PROCESS <|d2:PREFIX|>();
////*PROCESS <|d3:PREFIX|>(<|3:INVALID|>);
////*PROCESS <|d4:PREFIX|>(<|4:ANYCONDITION|>);
////*PROCESS <|d5:PREFIX|>(<|5:AREA|>);
////*PROCESS <|d6:PREFIX|>(<|6:ASSERTION|>);
////*PROCESS <|d7:PREFIX|>(<|7:ATTENTION|>);
////*PROCESS <|d8:PREFIX|>(<|8:ENDFILE|>);
////*PROCESS <|d9:PREFIX|>(<|9:ENDPAGE|>);
////*PROCESS <|d10:PREFIX|>(<|10:ERROR|>);
////*PROCESS <|d11:PREFIX|>(<|11:FINISH|>);
////*PROCESS <|d12:PREFIX|>(<|12:KEY|>);
////*PROCESS <|d13:PREFIX|>(<|13:NAME|>);
////*PROCESS <|d14:PREFIX|>(<|14:RECORD|>);
////*PROCESS <|d15:PREFIX|>(<|15:STORAGE|>);
////*PROCESS <|d16:PREFIX|>(<|16:TRANSMIT|>);
////*PROCESS <|d17:PREFIX|>(<|17:UNDEFINEDFILE|>);
//// // These should work.
////*PROCESS <|d20:PREFIX|>(<|20:CONFORMANCE|>);
////*PROCESS <|d21:PREFIX|>(<|21:CONVERSION|>);
////*PROCESS <|d22:PREFIX|>(<|22:CONV|>);
////*PROCESS <|d23:PREFIX|>(<|23:NOFIXEDOVERFLOW|>);
////*PROCESS <|d24:PREFIX|>(<|24:NOFOFL|>);
////*PROCESS <|d25:PREFIX|>(<|25:SIZE|>);
////*PROCESS <|d26:PREFIX|>(<|26:STRINGRANGE|>);
////*PROCESS <|d27:PREFIX|>(<|27:STRNG|>);
////*PROCESS <|d28:PREFIX|>(<|28:STRINGSIZE|>);
////*PROCESS <|d29:PREFIX|>(<|29:STRSZ|>);
////*PROCESS <|d30:PREFIX|>(<|30:SUBSCRIPTRANGE|>);
////*PROCESS <|d31:PREFIX|>(<|31:SUBRG|>);
////*PROCESS <|d32:PREFIX|>(<|32:UNDERFLOW|>);
////*PROCESS <|d33:PREFIX|>(<|33:UFL|>);
////*PROCESS <|d34:PREFIX|>(<|34:ZERODIVIDE|>);
////*PROCESS <|d35:PREFIX|>(<|35:ZDIV|>);
////*PROCESS <|d36:PREFIX|>(<|36:NOZDIV|> <|37:NOUNDERFLOW|>);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
// TODO ssmifi: Since Prefix does not override the previous settings, the dupe warning should probably be removed in the future.
verify.expectDiagnosticsAt(
  Array.from({ length: 15 }, (_, i) => `d${i + 2}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("PREFIX"),
  },
);
verify.expectDiagnosticsAt(
  Array.from({ length: 16 }, (_, i) => `d${i + 20}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("PREFIX"),
  },
);
verify.noDiagnosticsExceptAt("d2", [
  new RegExp(code.CompilerOptions.DupeOptionIssue.message("PREFIX")),
]);
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Prefix.InvalidParameter.message("INVALID"),
});
for (const [index, condition] of [
  "ANYCONDITION",
  "AREA",
  "ASSERTION",
  "ATTENTION",
  "ENDFILE",
  "ENDPAGE",
  "ERROR",
  "FINISH",
  "KEY",
  "NAME",
  "RECORD",
  "STORAGE",
  "TRANSMIT",
  "UNDEFINEDFILE",
].entries()) {
  verify.expectDiagnosticsAt(index + 4, {
    message:
      code.CompilerOptions.Prefix.ConditionIsAlwaysEnabled.message(condition),
  });
}
for (let i = 20; i < 38; i++) {
  verify.noDiagnostics(i);
}
verify.expectCompilerOptions({
  prefix: {
    conformance: true,
    conversion: true,
    fixedoverflow: false,
    invalidop: true,
    overflow: true,
    size: true,
    stringrange: true,
    stringsize: true,
    subscriptrange: true,
    underflow: false,
    zerodivide: false,
  },
});
