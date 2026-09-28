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

// Host variables resolve in the scope of the block their EXEC statement sits in, wherever
// in that block the statement is: first (right after the header), last (right before the
// block's END, which itself belongs to the enclosing scope), or after a nested block.

//// OUTER: PROC;
////   DCL <|1:O|> FIXED BIN(31);
////   INNER: PROC;
////     EXEC SQL SELECT 1 INTO :<|2>I1 FROM T;
////     DCL <|2:I1|> FIXED BIN(31);
////     DCL <|3:I2|> FIXED BIN(31);
////     NESTED: PROC;
////     END;
////     EXEC SQL SELECT 1 INTO :<|3>I2 FROM T;
////     EXEC SQL SELECT 1 INTO :<|1>O FROM T;
////   END;
////   EXEC SQL SELECT 1 INTO :<|1>O FROM T;
//// END;

verify.noParserDiagnostics();
linker.expectLinks();
