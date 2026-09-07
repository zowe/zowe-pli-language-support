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

//// DCL X FIXED INITIAL(1);
//// DCL S CHAR(3) INITIAL('AB');
//// DCL Y FIXED INITIAL(1 + 2);
//// PUT(<|1>X);
//// PUT(<|2>S);
//// PUT(<|3>Y);

hover.expectMarkdownAt(
  1,
  hover.codeBlock("DCL X FIXED INITIAL(1);"),
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock("DCL S CHARACTER(3) INITIAL('AB');"),
);
hover.expectMarkdownAt(
  3,
  hover.codeBlock("DCL Y FIXED INITIAL(...);"),
);
