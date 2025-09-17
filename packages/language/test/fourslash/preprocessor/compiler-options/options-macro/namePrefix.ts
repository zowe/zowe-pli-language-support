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
////*PROCESS PP(MACRO("<|1:NONAMEPREFIX|>"));
////*PROCESS PP(MACRO("<|2:NAMEPREFIX|>"));
////*PROCESS PP(MACRO("NAMEPREFIX(<|3:)|>"));
////*PROCESS PP(MACRO("NAMEPREFIX(<|4:'LOWER'|>)"));
////*PROCESS PP(MACRO("NAMEPREFIX(<|5:UPPER|>)"));
////*PROCESS PP(MACRO("NAMEPREFIX(<|6:X|>)"));

verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("NAMEPREFIX"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.ExpectedPlain.message(),
});
verify.expectDiagnosticsAt(5, {
  message:
    code.CompilerOptions.PPMacro.NamePrefix.InvalidParameterLength.message(
      "UPPER",
    ),
});
verify.noDiagnostics(6);

verify.expectCompilerOptions({
  macroOptions: {
    namePrefix: {
      character: "X",
    },
  },
});
