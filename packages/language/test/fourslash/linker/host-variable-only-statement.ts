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

// An EXEC statement that is the only statement of its block: there is no sibling
// statement to adopt, so the reference adopts the block itself and still resolves
// through the block's scope chain.

//// DCL <|1:G|> FIXED BIN(31);
//// P: PROC;
////   EXEC SQL SELECT 1 INTO :<|1>G FROM T;
//// END;

verify.noParserDiagnostics();
linker.expectLinks();
