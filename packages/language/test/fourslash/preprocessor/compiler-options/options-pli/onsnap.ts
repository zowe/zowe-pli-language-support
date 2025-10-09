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
////*PROCESS NOONSNAP;
////*PROCESS <|1:ONSNAP|>;
////*PROCESS <|2:ONSNAP|>(<|3:INVALID|>);
////*PROCESS <|4:ONSNAP|>(STRINGRANGE);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.OnSnap.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt([1, 2, 4], {
  message: code.CompilerOptions.MutexOptionIssue.message("ONSNAP"),
});
verify.expectCompilerOptions({
  onSnap: {
    stringRange: true,
    stringSize: false,
  },
});
