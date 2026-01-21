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

//// DEFINE ALIAS NAME CHAR(15);
//// DCL ID TYPE NAME;
//// PUT(<|1>ID);

hover.expectMarkdownAt(1, hover.codeBlock(`DCL ID CHARACTER(15);`));
