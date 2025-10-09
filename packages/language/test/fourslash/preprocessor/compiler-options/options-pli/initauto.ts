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
////*PROCESS NOINITAUTO;
////*PROCESS <|1:INITAUTO|>;
////*PROCESS <|2:INITAUTO|>(<|3:)|>;
////*PROCESS <|4:INITAUTO|>(<|5:'SHORT'|>);
////*PROCESS <|6:INITAUTO|>(<|7:LONG|>);
////*PROCESS <|8:INITAUTO|>(<|9:FULL|>);

verify.expectDiagnosticsAt([1, 2, 4, 6, 8], {
  message: code.CompilerOptions.MutexOptionIssue.message("INITAUTO"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.InitAuto.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(7, {
  message: code.CompilerOptions.InitAuto.InvalidParameter.message("LONG"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.ExpectedPlain.message(),
});
verify.expectCompilerOptions({
  initAuto: "FULL",
});
