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

//// DCL S FIXED;
//// DCL 1 ZERO,
////       2 A,
////         3 B FIXED,
////       2 AA,
////         3 B FIXED,
////         3 C (S REFER(<|B|>));

verify.expectDiagnosticsAt("B", code.Severe.IBM1881I);
await verify.expectCodeActionCountAt("B", 2);
await verify.expectCodeActionAt(
  "B",
  'Change to "AA.B"',
  `
  DCL S FIXED;
  DCL 1 ZERO,
        2 A,
          3 B FIXED,
        2 AA,
          3 B FIXED,
          3 C (S REFER(AA.B));
`,
);
