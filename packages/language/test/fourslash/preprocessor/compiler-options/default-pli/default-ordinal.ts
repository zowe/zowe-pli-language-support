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
////*PROCESS DEFAULT(<|1:ORDINAL|>);
////*PROCESS DEFAULT(ORDINAL(<|2:)|>);
////*PROCESS DEFAULT(ORDINAL(<|3:INVALID|>));
////*PROCESS DEFAULT(ORDINAL(<|4:MAX|>));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Default.InvalidParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  default: {
    ordinal: { type: "MAX" },
  },
});
