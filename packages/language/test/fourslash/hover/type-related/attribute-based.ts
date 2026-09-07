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

//// DCL P POINTER;
//// DCL X CHAR(10) BASED(P);
//// DCL Y CHAR(10) BASED;
//// PUT(<|1>X);
//// PUT(<|2>Y);

hover.expectMarkdownAt(1, hover.codeBlock("DCL X CHARACTER(10) BASED(P);"));
hover.expectMarkdownAt(2, hover.codeBlock("DCL Y CHARACTER(10) BASED;"));
