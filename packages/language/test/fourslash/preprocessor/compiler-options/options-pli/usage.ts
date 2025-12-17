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
////*PROCESS <|1:USAGE|>;
////*PROCESS <|d2:USAGE|>();
////*PROCESS <|d3:USAGE|>(<|2:INVALID|>);
////*PROCESS <|d3:USAGE|>(<|3:INVALID|>());
////*PROCESS <|d4:USAGE|>(HEX(<|4:INVALID|>));
////*PROCESS <|d5:USAGE|>(REGEX(<|5:INVALID|>));
////*PROCESS <|d6:USAGE|>(ROUND(<|6:INVALID|>));
////*PROCESS <|d7:USAGE|>(SUBSTR(<|7:INVALID|>));
////*PROCESS <|d8:USAGE|>(UNSPEC(<|8:INVALID|>));
////*PROCESS <|d9:USAGE|>(UUID(<|9:INVALID|>));
////*PROCESS <|d10:USAGE|>(VALIDDATE(<|10:INVALID|>));
////*PROCESS <|d11:USAGE|>(HEX(CURRENTSIZE) REGEX(NORESET) ROUND(ANS));
////*PROCESS <|d12:USAGE|>(SUBSTR(LOOSE) UNSPEC(ANS) UUID(LOWER) VALIDDATE(STRICT));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(
  Array.from({ length: 9 }, (_, i) => `d${i + 2}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("USAGE"),
  },
);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Usage.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.Usage.InvalidHexParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Usage.InvalidRegexParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.Usage.InvalidRoundParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Usage.InvalidSubstrParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.Usage.InvalidUnspecParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(9, {
  message: code.CompilerOptions.Usage.InvalidUuidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(10, {
  message:
    code.CompilerOptions.Usage.InvalidValidDateParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  usage: {
    hex: constants.CompilerOptions.UsageHex.CURRENTSIZE,
    regex: {
      reset: false,
    },
    round: constants.CompilerOptions.UsageRound.ANS,
    substr: constants.CompilerOptions.UsageSubstr.LOOSE,
    unspec: constants.CompilerOptions.UsageUnspec.ANS,
    uuid: constants.CompilerOptions.UsageUuid.LOWER,
    validDate: constants.CompilerOptions.UsageValidDate.STRICT,
  },
});
