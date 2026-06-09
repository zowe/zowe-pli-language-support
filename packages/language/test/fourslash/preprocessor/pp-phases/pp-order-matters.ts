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

// The PP() order is significant, and each phase transforms the tokens produced by the
// previous one (Token[] -> phase -> Token[]).
//
// The companion test `macro-expanded-exec-sql.ts` uses PP(MACRO SQL): the MACRO phase
// runs first and expands SOME_SQL_CODE to `INCLUDE SQLCA`, so the SQL phase then resolves
// `EXEC SQL INCLUDE SQLCA;` to the included copybook content (`DECLARE LIB_VAR FIXED;`).
//
// Here, with PP(SQL MACRO), the SQL phase runs *first* before the macro variable exists.
// It sees the literal `EXEC SQL SOME_SQL_CODE;`, which is not a recognized SQL statement,
// so it replaces it with the empty `DO; END;` placeholder. The MACRO phase then runs on
// the SQL phase's output: it consumes the `%DCL`/assignment statements (which emit no
// tokens) and leaves the `DO; END;` behind. The include is therefore never resolved,
// proving the SQL phase truly ran before the macro substitution.
//
// TODO: What is the correct error handling behavior here?
// Should the SQL phase emit an error for unrecognized SQL syntax, or is it acceptable to just produce no tokens
// and let the downstream compiler phases report errors for missing tokens?

// @filename: cpy/sqlca.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
////*PROCESS PP(SQL MACRO);
//// %DCL SOME_SQL_CODE CHAR;
//// %SOME_SQL_CODE = 'INCLUDE SQLCA';
//// EXEC SQL SOME_SQL_CODE;

preprocessor.expectTokens(["DO", ";", "END", ";"]);
