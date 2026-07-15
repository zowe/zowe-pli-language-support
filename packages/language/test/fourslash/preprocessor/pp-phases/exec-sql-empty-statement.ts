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
 * An empty `EXEC SQL;` statement is still recognized by `scanExecFragments` (the tokenizer
 * consumes it as an EXEC statement, so the scan must too) and replaced like any other
 * statement - the raw `EXEC SQL` tokens must not leak to the final parse, where they would
 * only produce generic grammar errors. The SQL engine may report its own diagnostic for the
 * empty statement body; the host grammar parse stays clean.
 */
//// TEST: PROC;
////   EXEC SQL;
//// END;

verify.noParserDiagnostics();
// The statement was replaced with the standard `DO; END;` shape ...
preprocessor.containsTokens(["DO", ";", "END", ";"]);
// ... and no raw EXEC tokens leaked to the parser.
preprocessor.not.containsTokens(["EXEC"]);
preprocessor.not.containsTokens(["SQL"]);
