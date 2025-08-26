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
////*PROCESS NAMES(<|1:'@#$%'|>);
////*PROCESS <|2:NAMES|>('@#$!', <|3:'@#$%'|>);
////*PROCESS <|4:NAMES|>('@#$!', <|5:'@#$!!'|>);
////*PROCESS <|6:NAMES|>('@#$!', <|7:'@#$!`'|>);
////*PROCESS <|8:NAMES|>('@#$!', @#$!);

verify.expectDiagnosticsAt([1, 3], {
  message: code.CompilerOptions.Names.CharacterAlreadyDefined.message(
    "%",
    "NAMES",
  ),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Names.CharacterAlreadyDefined.message(
    "!",
    "NAMES",
  ),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.Names.InvalidParameterLengths.message("NAMES"),
});
verify.expectDiagnosticsAt([2, 4, 6, 8], {
  message: code.CompilerOptions.DupeOptionIssue.message("NAMES"),
});
verify.expectCompilerOptions({
  names: {
    extralingChar: "@#$!",
    uppExtralingChar: "@#$!",
  },
});
