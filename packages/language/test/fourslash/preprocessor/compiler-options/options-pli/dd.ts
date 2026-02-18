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
////*PROCESS <|1:DD|>(MYPRINT,MYINPUT,MYLIB,MYPUNCH,MYLIN,MYADATA,MYXMLSD,MYDEBUG,EXTRA);
////*PROCESS <|DD|>(<|3:123INVALID|>);
////*PROCESS <|DD|>(<|5:MY-PRINT|>);
////*PROCESS <|DD|>();
////*PROCESS <|DD|>(MYPRINT,MYINPUT,MYLIB,MYPUNCH,MYLIN,MYADATA,MYXMLSD,MYDEBUG);

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(9, 0, 8),
});
verify.expectDiagnosticsAt("DD", {
  message: code.CompilerOptions.DupeOptionIssue.message("DD"),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.DD.InvalidParameter.message("123INVALID"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.DD.InvalidParameter.message("MY-PRINT"),
});
verify.expectCompilerOptions({
  dd: {
    sysprint: "MYPRINT",
    sysin: "MYINPUT",
    syslib: "MYLIB",
    syspunch: "MYPUNCH",
    syslin: "MYLIN",
    sysadata: "MYADATA",
    sysxmlsd: "MYXMLSD",
    sysdebug: "MYDEBUG",
  },
});
