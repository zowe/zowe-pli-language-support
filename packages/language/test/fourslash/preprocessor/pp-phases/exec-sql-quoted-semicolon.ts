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
 * A `;` inside a string literal in an `EXEC SQL` body must not end the statement early -
 * the tokenizer's EXEC fragment scan and the preprocessor's `scanExecFragments` must agree
 * on the full extent, so the replacement covers the whole statement and nothing after the
 * quoted `;` leaks to the final parse as raw tokens.
 */
//// TEST: PROC;
////   DCL X CHAR(1);
////   EXEC SQL SELECT ';' INTO :X FROM T;
//// END;

verify.noParserDiagnostics();
// The whole statement was replaced: the re-embedded host variable plus `DO; END;` ...
preprocessor.containsTokens(["X", "DO", ";", "END", ";"]);
// ... and no tail of the statement (after the quoted `;`) leaked as host tokens.
preprocessor.not.containsTokens(["FROM"]);
preprocessor.not.containsTokens(["SELECT"]);
