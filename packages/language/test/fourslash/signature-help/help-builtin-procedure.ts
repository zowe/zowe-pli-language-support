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

//// %DCL A CHARACTER;
//// %A = SUBSTR<|left>(<|0>"hallo", <|1>1, <|2>2); <|outside>

const expectedSignatureMarkdown = `\`SUBSTR\` returns a substring, specified by \`offset\` and
\`length\`, of \`string\`.

\`length\` must be nonnegative, and the values of \`offset\` and
\`length\` must be such that the substring lies entirely within
the current length of \`string\`.

If \`offset = LENGTH(string)+1\` and \`length = 0\`, the null
string is returned.`;
const expectedParameterMarkdown = `\`offset: FIXED\`

Expression that specifies the starting
position of the substring in \`string\`.

\`offset\` should have \`FIXED\` type, and if not, it is
converted thereto.`;
signatureHelp.expectMarkdownSignatureAt(1, expectedSignatureMarkdown);
signatureHelp.expectMarkdownParameterAt(1, expectedParameterMarkdown);
signatureHelp.expectNoHelp("outside");
signatureHelp.expectNoHelp("left");
signatureHelp.expectParameterIndexAt(0, 0);
signatureHelp.expectParameterIndexAt(1, 1);
signatureHelp.expectParameterIndexAt(2, 2);
