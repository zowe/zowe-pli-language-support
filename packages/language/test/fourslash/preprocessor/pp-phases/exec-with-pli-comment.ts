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
 * A PL/I comment inside an `EXEC SQL` body is blanked by the comment-strip pre-pass before
 * the SQL preprocessor scans the text - in particular, the `;` inside the comment must not
 * terminate the EXEC fragment early.
 */
//// TEST: PROC;
////   DCL X FIXED BIN(31);
////   EXEC SQL SELECT 1 /* semi; inside */ INTO :X FROM T;
//// END;

preprocessor.containsTokens(["TEST", ":", "PROC", ";", "X", "DO", ";", "END"]);
verify.noParserDiagnostics();
