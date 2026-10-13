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

// A copybook consisting of nothing but an EXEC statement: the copybook itself has no
// parsed statement, so the host variable must resolve through the include site's scope.

// @filename: cpy/q.pli
//// EXEC SQL SELECT 1 INTO :<|1>X FROM T;

// @filename: main.pli
//// P: PROC;
////   DCL <|1:X|> FIXED BIN(31);
////   EXEC SQL INCLUDE q;
//// END;

verify.noParserDiagnostics();
verify.noLinkingDiagnostics();
linker.expectLinks();
