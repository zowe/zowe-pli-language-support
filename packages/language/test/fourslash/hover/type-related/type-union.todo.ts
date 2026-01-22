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

//// DEFINE STRUCTURE 1 XXX UNION, 2 MAILBOX FIXED DEC(5), 2 PHYSICAL, 3 STREET CHAR(30), 3 CITY CHAR(20);
//// DCL LOCATION TYPE XXX;
//// PUT(<|1>LOCATION);
//// PUT(LOCATION.PHYSICAL.<|2>CITY);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 LOCATION UNION,
      2 MAILBOX FIXED DECIMAL PRECISION(5),
      2 PHYSICAL,
        3 STREET CHARACTER(30),
        3 CITY CHARACTER(20);`),
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock(`DCL 1 LOCATION UNION,
      2 PHYSICAL,
      3 CITY CHARACTER(20);`),
);
