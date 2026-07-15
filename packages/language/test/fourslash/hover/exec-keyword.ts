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
 * Hover over `EXEC CICS` keyword tokens. No markup generator matches a plain
 * keyword inside an EXEC fragment, so the hover is (by design) empty markdown -
 * pinned here so a change in that behavior is noticed.
 */
// @wrap: main
//// DCL COMM_AREA CHAR(100);
//// EXEC <|1>CICS <|2>LINK PROGRAM('PGM01') COMMAREA(COMM_AREA);

hover.expectMarkdownAt(1, "");
hover.expectMarkdownAt(2, "");
