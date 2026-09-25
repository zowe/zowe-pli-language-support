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

// With CICS running *before* SQL, the CICS phase sees the raw `EXEC SQL` statement. Any
// other preprocessor's statement is opaque to it: the `DFHRESP(...)` inside must stay
// untouched for the SQL phase (the host tokenizer treats every EXEC statement as one
// token, and the engines' text walk mirrors that).

////*PROCESS PP(CICS SQL);
//// TEST: PROC;
////   DCL X FIXED BIN(31);
////   EXEC SQL SELECT DFHRESP(NORMAL) INTO :X FROM T;
////   IF X = DFHRESP(NORMAL) THEN
////     PUT('OK');
//// END;

verify.noParserDiagnostics();
preprocessor.containsTokens(["IF", "X", "=", "0", "THEN"]);
preprocessor.not.containsTokens(["DFHRESP"]);
