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
////  * Description :)
////  */
//// PROC1: PROCEDURE RETURNS(FIXED); END;
//// PROC2: PROCEDURE RETURNS(FIXED); END;
//// DCL A FIXED;
//// A = <|1>PROC1();
//// A = <|2>PROC2();

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`PROC1: PROCEDURE RETURNS(FIXED); END;`) +
    `
---
Description :)`,
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock(`PROC2: PROCEDURE RETURNS(FIXED); END;`),
);
