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

//// DCL 1 A, 2 B, 3 C, 4 D FIXED;
//// PUT(A.<|1>D);
//// PUT(B.<|2>D);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 A,
      2 B,
        3 C,
          4 D FIXED;`),
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock(`DCL 1 B,
      3 C,
        4 D FIXED;`),
);
