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
 * A `SQL TYPE IS LOB` declaration inside an `EXEC SQL INCLUDE`d copybook (the DCLGEN
 * shape) finds its enclosing procedure in the *including* file: the clause is replaced
 * with the `LIKE` reference and the LOB declarations are inserted after the outer
 * procedure's semicolon - not silently dropped because the copybook itself has no `PROC`.
 */

// @filename: cpy/lobcpy.pli
//// DCL CLOB_VAR SQL TYPE IS CLOB(1K);

// @filename: main.pli
//// TEST: PROC;
////   EXEC SQL INCLUDE lobcpy;
//// END;

verify.noParserDiagnostics();
preprocessor.containsTokens(["CLOB_VAR", "LIKE", "SQL_LOB1024"]);
preprocessor.containsTokens(["SQL_LOB1024", "BASED"]);
