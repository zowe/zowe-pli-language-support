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
////*PROCESS <|1:JSON|>;
////*PROCESS <|2:JSON|>(<|3:)|>;
////*PROCESS <|4:JSON|>(<|5:INVALID|>, <|6:INVALID|>);
////*PROCESS <|7:JSON|>(CASE(<|8:INVALID|>));
////*PROCESS <|9:JSON|>(GET(<|10:INVALID|>));
////*PROCESS <|11:JSON|>(PARSE(<|12:INVALID|>));
////*PROCESS <|13:JSON|>(CASE(ASIS), NOTRIMR);
////*PROCESS <|14:JSON|>(GET(IGNORECASE) PARSE(V2));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Json.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Json.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(8, {
  message: code.CompilerOptions.Json.InvalidCaseParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(10, {
  message: code.CompilerOptions.Json.InvalidGetParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(12, {
  message: code.CompilerOptions.Json.InvalidParseParameter.message("INVALID"),
});
// TODO ssmifi: In an upcoming revision, the JSON compiler option should not report dupes. (#321)
verify.expectDiagnosticsAt([2, 4, 7, 9, 11, 13, 14], {
  message: code.CompilerOptions.DupeOptionIssue.message("JSON"),
});
verify.expectCompilerOptions({
  json: {
    case: "ASIS",
    trimr: false,
    get: "IGNORECASE",
    parse: "V2",
  },
});
