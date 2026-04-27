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

//// DCL A FIXED DIM(10);
//// CALL QUICKSORT(<|arg0>A);

signatureHelp.expectParameterIndexAt("arg0", 0);
signatureHelp.expectMarkdownParameterAt(
  "arg0",
  `\`x: ANY DIMENSION(*)\`

An array expression. x must be a one-dimensional
array of scalars. If x is an array of NONVARYING BIT, it must
be aligned.

The elements of the array x must satisfy one of the following:

- They must be computational and not COMPLEX
- They must be POINTERs
- They must be HANDLEs
- They must be ORDINALs`,
);
