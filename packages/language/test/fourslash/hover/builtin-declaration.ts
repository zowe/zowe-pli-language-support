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

//// SQLDA.SQLVAR.<|1>SQLIND = 1;

hover.expectMarkdownAt(1, hover.codeBlock(`DCL 1 SQLDA BASED(/*TODO locator*/),
      2 SQLVAR DIMENSION(/*TODO bounds*/),
        3 SQLIND POINTER;`));
