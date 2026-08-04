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

////*PROCESS CASE(UPPER);
//// DCL <|resourceName1|> CHAR(8) INITIAL('A');
//// DCL <|ACQFAIL|> CHAR(8) INITIAL('B');
//// DCL <|RESOURCENAME|> CHAR(8) INITIAL('C');
//// EXEC CICS DEQ RESOURCE(<|resourceName1>resourceName1);
//// EXEC CICS DEQ RESOURCE(<|ACQFAIL>ACQFAIL);
//// EXEC CICS DEQ RESOURCE(<|RESOURCENAME>RESOURCENAME);

linker.expectLinks();
// TODO: Uncomment when hover is implemented
// hover.expectMarkdownAt(
//   "resourceName1",
//   "```pli\nDCL RESOURCENAME1 CHARACTER(8) INITIAL(...);\n```\n",
// );
