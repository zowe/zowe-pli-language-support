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

/// <reference path="../framework.ts" />

/**
 * Go-to-definition on an `EXEC SQL` host-variable whose name contains the PL/I extra
 * identifier characters (`#`) resolves to its `DCL` - the embedded-image lookup must
 * treat `#`/`@`/`$` as identifier characters, not word boundaries.
 *
 * TODO: Marked `.fail.`: the host-side embedded-image lookup (`findEmbeddedImage`) handles
 * `#`/`@`/`$` correctly, but the db2 engine's lexer (`Db2SqlExecLexer.g4`, `IDENTIFIER`
 * rule) does not include `#`/`@`/`$` in its identifier character set, so `DEPT#X` never
 * reaches the host as a single Identifier token. Extend the engine lexer's identifier
 * character set to the PL/I extra identifier characters, then remove the `.fail.` marker.
 */
// @wrap: main
//// DCL <|1:DEPT#X|> CHAR(3);
//// EXEC SQL SELECT A INTO :<|1>DEPT#X FROM T;

verify.noParserDiagnostics();
linker.expectLinks();
