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
////*PROCESS HGPR(NOPRESERVE);
////*PROCESS <|1:HGPR|>(<|2:INVALID|>);
////*PROCESS <|3:HGPR|>(PRESERVE);
////*PROCESS <|4:HGPR|>(<|5:)|>;
////*PROCESS <|6:HGPR|>;

verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.DupeOptionIssue.message("HGPR"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Hgpr.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Hgpr.InvalidParameter.message(""),
});
verify.expectDiagnosticsAt(6, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectCompilerOptions({
  hgpr: {
    preserve: true,
  },
});
