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
////*PROCESS <|1:XINFO|>;
////*PROCESS <|d2:XINFO|>();
////*PROCESS <|d3:XINFO|>(<|2:INVALID|>);
////*PROCESS <|d3:XINFO|>(<|3:INVALID|>());
////*PROCESS <|d4:XINFO|>(<|4:NOXML|>);
////*PROCESS <|d5:XINFO|>(XML(<|5:INVALID|>));
////*PROCESS <|d6:XINFO|>(XML(HASH));
////*PROCESS <|d7:XINFO|>(DEF);
////*PROCESS <|d8:XINFO|>(MSG SYM);
////*PROCESS <|d9:XINFO|>(NOSYM, SYN);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(
  Array.from({ length: 8 }, (_, i) => `d${i + 2}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("XINFO"),
  },
);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.XInfo.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.ExpectedPlain.message(),
});
verify.noDiagnostics(4);
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.XInfo.InvalidXmlParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  xInfo: {
    xml: { hash: true },
    def: true,
    msg: true,
    sym: false,
    syn: true,
  },
});
