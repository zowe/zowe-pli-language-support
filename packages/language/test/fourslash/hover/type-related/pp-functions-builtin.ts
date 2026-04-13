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
  hover.codeBlock(`SUBSTR: PROC(string, offset, length) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE offset FIXED;
   DECLARE length FIXED OPTIONAL;
 END;`) +
    `
---
\`SUBSTR\` returns a substring, specified by \`offset\` and
\`length\`, of \`string\`.

\`length\` must be nonnegative, and the values of \`offset\` and
\`length\` must be such that the substring lies entirely within
the current length of \`string\`.

If \`offset = LENGTH(string)+1\` and \`length = 0\`, the null
string is returned.

*@param*
{CHARACTER} string Expression specifies the string from
which the substring is extracted.

\`string\` should have \`CHARACTER\` type, and if not, it is
converted thereto.

*@param*
{FIXED} offset Expression that specifies the starting
position of the substring in \`string\`.

\`offset\` should have \`FIXED\` type, and if not, it is
converted thereto.

*@param*
{FIXED} length Expression that specifies the length of the
substring in \`string\`.

\`length\` should have \`FIXED\` type, and if not, it is
converted thereto.

*@returns*
{CHARACTER} substring specified by \`offset\` and
\`length\` of \`string\``,
);
