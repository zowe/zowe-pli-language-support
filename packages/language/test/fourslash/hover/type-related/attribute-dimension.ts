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

//// DCL X(5) FIXED;
//// DCL Y(3:5) FIXED;
//// DCL Z(*) FIXED CONTROLLED;
//// PUT(<|1>X);
//// PUT(<|2>Y);
//// PUT(<|3>Z);

hover.expectMarkdownAt(
  1,
  hover.codeBlock("DCL X DIMENSION(5) FIXED;"),
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock("DCL Y DIMENSION(3:5) FIXED;"),
);
hover.expectMarkdownAt(
  3,
  hover.codeBlock("DCL Z DIMENSION(*) FIXED CONTROLLED;"),
);
