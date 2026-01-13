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

//// DCL 1 ADDRESS UNION,
////       2 MAILBOX FIXED DECIMAL(4),
////       2 LOCATION,
////         3 STREET CHAR(200),
////         3 ZIP FIXED DECIMAL(5);
//// PUT(<|1>ADDRESS);
//// PUT(<|2>LOCATION);
//// PUT(<|3>ZIP);
//// PUT(<|4>MAILBOX);

hover.expectMarkdownAt(3, hover.codeBlock(`DCL 1 ADDRESS UNION,
      2 LOCATION,
        3 ZIP FIXED DECIMAL PRECISION(5);`));
hover.expectMarkdownAt(2, hover.codeBlock(`DCL 1 ADDRESS UNION,
      2 LOCATION,
        3 STREET CHARACTER(200),
        3 ZIP FIXED DECIMAL PRECISION(5);`));
hover.expectMarkdownAt(1, hover.codeBlock(`DCL 1 ADDRESS UNION,
      2 MAILBOX FIXED DECIMAL PRECISION(4),
      2 LOCATION,
        3 STREET CHARACTER(200),
        3 ZIP FIXED DECIMAL PRECISION(5);`));
