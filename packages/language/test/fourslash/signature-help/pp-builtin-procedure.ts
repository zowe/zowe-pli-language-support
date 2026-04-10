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

//// %DCL A STRING;
//// %A = SUBSTR("hallo", <|1>1, 2);

const expectedMarkdown = hover.codeBlock(`SUBSTR: PROC(string, offset, length) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE offset FIXED;
   DECLARE length FIXED OPTIONAL;
 END;`);
signatureHelp.expectMarkdownAt(1, expectedMarkdown);
