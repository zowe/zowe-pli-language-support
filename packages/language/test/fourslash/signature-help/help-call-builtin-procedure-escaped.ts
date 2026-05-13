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

// @filename: pli-builtin:///xxx.pli
//// /**
////  * A < B > C
////  * `<>`
////  * D E F
////  * ```
////  * G < H > I
////  * ```
////  */
//// XXX: PROCEDURE(INPUT);
////   DCL INPUT FIXED;
//// END;
//// CALL XX<|1>X(123);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`XXX: PROCEDURE(INPUT);
   DCL INPUT FIXED;
 END;`) +
    `
---
A &lt; B &gt; C
\`<>\`
D E F
\`\`\`
G < H > I
\`\`\``,
);
