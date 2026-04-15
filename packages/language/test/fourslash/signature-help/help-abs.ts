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

//// DCL A FIXED;
//// A = AB<|none>S(<|arg0>A);

signatureHelp.expectParameterIndexAt("arg0", 0);
signatureHelp.expectNoHelp("none");
signatureHelp.expectMarkdownSignatureAt(
  "arg0",
  `\`ABS\` returns the absolute value of \`value\`. It is the positive
value of \`value\`.
The mode of the result is \`REAL\`. The result has the base, scale,
and precision of \`value\`, except when \`value\` is
\`COMPLEX FIXED(p,q)\`. In the latter case, the result is
\`REAL FIXED(min(n,p+1),q)\` where \`n\` is \`N\` for \`DECIMAL\`
and \`M\` for \`BINARY\`.`,
);
