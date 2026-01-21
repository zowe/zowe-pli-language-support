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

//// DCL 1 ADDRESS UNION,
////       2 MAILBOX FIXED DECIMAL(5),
////       2 LOCATION,
////         3 STREET CHAR(20),
////         3 CITY CHAR(15);
//// DCL <|1>ADDR LIKE ADDRESS;

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 ADDR UNION,
      2 MAILBOX FIXED DECIMAL PRECISION(5),
      2 LOCATION,
        3 STREET CHARACTER(20),
        3 CITY CHARACTER(15);`),
);
