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

//// DCL P BIN FIXED;
//// DCL 1 A,
////       2 B,
////         3 BB,
////           4 D FIXED,
////       2 BB,
////         3 D FIXED,
////       2 BBB (P REFER(<|D|>));

verify.expectDiagnosticsAt("D", code.Severe.IBM1881I);
await verify.expectCodeActionAt(
  "D",
  'Change to "B.BB.D"',
  `
    DCL P BIN FIXED;
    DCL 1 A,
          2 B,
            3 BB,
              4 D FIXED,
          2 BB,
            3 D FIXED,
          2 BBB (P REFER (B.BB.D));
`,
);
await verify.expectCodeActionAt(
  "D",
  'Change to "A.BB.D"',
  `
    DCL P BIN FIXED;
    DCL 1 A,
          2 B,
            3 BB,
              4 D FIXED,
          2 BB,
            3 D FIXED,
          2 BBB (P REFER(A.BB.D));
`,
);
