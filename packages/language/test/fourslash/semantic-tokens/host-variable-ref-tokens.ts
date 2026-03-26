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

// @wrap: main
//// DCL MGR_NUM FIXED BIN(31);
//// DCL INT_DEPT FIXED BIN(31);
//// EXEC SQL UPDATE DEPARTMENT
////          SET MGRNO = :<|variable:MGR_NUM|>
////          WHERE DEPTNO = :<|variable:INT_DEPT|>;

semanticTokens.expectAt("variable");
