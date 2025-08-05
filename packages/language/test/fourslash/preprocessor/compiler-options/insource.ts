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
////*PROCESS NOINSOURCE;
////*PROCESS <|1:INSOURCE|>;
////*PROCESS <|2:INSOURCE|>(<|3:INVALID|>);
////*PROCESS <|4:INSOURCE|>(<|5:'FULL'|>);
////*PROCESS <|6:INSOURCE|>(FULL);

verify.expectDiagnosticsAt([1, 2, 4, 6], {
  message: code.CompilerOptions.MutexOptionIssue.message("INSOURCE"),
});

verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.inSource.WrongParameter.message("INVALID"),
});

verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlain.message(),
});

verify.expectCompilerOptions({
  inSource: {
    type: "FULL",
  },
});
