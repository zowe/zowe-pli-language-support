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
 * Regression test: when the tokenizer's EXEC fragment scan ended at the first `;` even
 * inside a string literal, the rest of this statement (including `DFHRESP(...)`) leaked
 * as host tokens - the DFHRESP phase then recorded an edit inside the range the CICS
 * preprocessor replaces as a whole, crashing on overlapping edits. With the quote-aware
 * scan, the entire statement is one fragment and processes cleanly.
 */
//// TEST: PROC;
////   DCL VAR CHAR(8);
////   EXEC CICS WRITEQ TS QUEUE('A;B') FROM(DFHRESP(NORMAL));
//// END;

verify.noParserDiagnostics();
// The statement was consumed and replaced as one unit.
preprocessor.containsTokens(["DO", ";", "END", ";"]);
// No tail of the statement leaked as host tokens after the quoted `;`.
preprocessor.not.containsTokens(["QUEUE"]);
preprocessor.not.containsTokens(["WRITEQ"]);
