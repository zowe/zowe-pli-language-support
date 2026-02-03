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

//// DCL 1 A, 2 B FIXED;
//// DCL 1 X, 2 Y, 3 Z LIKE A;
//// PUT(X.Y.Z.<|1>B);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 X,
      2 Y,
        3 Z,
          4 B FIXED;`),
);
