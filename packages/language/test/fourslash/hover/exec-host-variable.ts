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
 * Hover over a host-variable reference *inside* an `EXEC SQL` body resolves to
 * its `DCL` - the hover twin of `linker/host-variable.ts` (go-to-definition).
 */
// @wrap: main
//// DCL MGR_NUM FIXED BIN(31);
//// EXEC SQL UPDATE DEPARTMENT
////          SET MGRNO = :<|1>MGR_NUM
////          WHERE DEPTNO = 5;

hover.expectMarkdownAt(
  1,
  hover.codeBlock("DCL MGR_NUM FIXED BINARY PRECISION(31);"),
);
