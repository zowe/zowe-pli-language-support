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

// A copybook included more than once: each inclusion's host variables resolve in the
// scope of *their own* include site. P1's inclusion must resolve to P1's DCL even though
// the copybook's token position is shared with P2's inclusion (which has no DCL and
// legitimately stays unresolved).

// @filename: cpy/q.pli
//// EXEC SQL SELECT 1 INTO :<|1>X FROM T;
//// PUT('A');

// @filename: main.pli
//// P1: PROC;
////   DCL <|1:X|> FIXED BIN(31);
////   EXEC SQL INCLUDE q;
//// END;
//// P2: PROC;
////   EXEC SQL INCLUDE q;
//// END;

verify.noParserDiagnostics();
// Find-references from P1's DCL must reach the host variable of P1's inclusion.
linker.expectReferences();
