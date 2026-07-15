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
 * Go-to-definition on an `EXEC SQL` host variable still works when an earlier macro
 * expansion shifted the text offsets (the SQL phase runs over the macro *output*, so its
 * coordinate space differs from the original document).
 */
// @compiler: true
//// %DCL T CHAR;
//// %T = 'FIXED BIN(31)';
//// DCL <|1:MGR_NUM|> T;
//// EXEC SQL UPDATE DEPT SET MGRNO = :<|1>MGR_NUM;

linker.expectLinks();
