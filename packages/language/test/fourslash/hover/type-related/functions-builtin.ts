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

//// DCL STR CHAR(300);
//// STR = <|1>SUBSTR('Hello, World!', 1, 5);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`SUBSTR: PROC (x, y, z) RETURNS (ANY<CHARACTER>);
    DCL x ANY<CHARACTER>;
    DCL y FIXED BINARY;
    DCL z FIXED BINARY OPTIONAL;
 END;`) +
    `
---
SUBSTR returns a substring, specified by \`y\` and \`z\`, of
\`x\`.

The STRINGRANGE condition is raised if \`z\` is negative or if
the values of \`y\` and \`z\` are such that the substring does
not lie entirely within the current length of \`x\`. It is not
raised when \`y\` = LENGTH(\`x\`)+1 and \`z\` = 0. For an
example of the SUBSTR built-in function, see SEARCH.

*@param*
x String expression. It specifies the
string from which the substring is extracted. If \`x\` is not
a string, it is converted to character.

*@param*
y Expression that is converted to FIXED
BINARY(31,0). \`y\` specifies the starting position of the
substring in \`x\`.

*@param*
[z] Expression that is converted to FIXED
BINARY(31,0). \`z\` specifies the length of the substring in
\`x\`. If \`z\` is zero, a null string is returned. If \`z\`
is omitted, the substring returned is position \`y\` in \`x\`
to the end of \`x\`.

*@returns*
The substring of \`x\` starting at
\`y\` with length \`z\`.`,
);
