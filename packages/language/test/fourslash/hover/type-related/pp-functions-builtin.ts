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

//// %DCL STR CHARACTER;
//// %STR = <|1>SUBSTR('Hello, World!', 1, 5);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`SUBSTR: PROC(STRING,OFFSET,LENGTH) RETURNS(CHARACTER);`)+`

---

\`SUBSTR\` returns a substring, specified by \`offset\` and
\`length\`, of \`string\`.

\`length\` must be nonnegative, and the values of \`offset\` and
\`length\` must be such that the substring lies entirely within
the current length of \`string\`.

If \`offset = LENGTH(string)+1\` and \`length = 0\`, the null
string is returned.`,
);
