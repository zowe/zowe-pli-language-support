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

/**
 * A file that `EXEC SQL INCLUDE`s itself must not recurse without bound: the recursive
 * include is rejected with the same diagnostic an unresolvable include produces (mirroring
 * the macro `%INCLUDE` behavior), while the first include of the file stays legal.
 */

// @filename: cpy/selfinc.pli
//// DCL SELF_VAR FIXED;
//// <|inc:EXEC SQL INCLUDE selfinc;|>

// @filename: main.pli
//// EXEC SQL INCLUDE selfinc;

verify.expectDiagnosticsAt("inc", code.Severe.IBM1848I);
preprocessor.expectTokens(`
  DCL SELF_VAR FIXED;
`);
