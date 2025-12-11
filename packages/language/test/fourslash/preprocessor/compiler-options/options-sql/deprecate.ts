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
////*PROCESS PP(SQL("DEPRECATE(<|1:LOWER|>)"));
////*PROCESS PP(SQL("DEPRECATE(<|2:LOWER|>())"));
////*PROCESS PP(SQL("DEPRECATE(STMT(<|3:INVALID|>))"));
////*PROCESS PP(SQL("DEPRECATE(STMT(GRANT))"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(2, {
  message:
    code.CompilerOptions.PPSQL.Deprecate.InvalidSubOption.message("LOWER"),
});
verify.expectDiagnosticsAt(3, {
  message:
    code.CompilerOptions.PPSQL.Deprecate.InvalidSubStatement.message("INVALID"),
});

verify.expectCompilerOptions({
  sqlOptions: {
    deprecate: new Set(["GRANT"]),
  },
});
