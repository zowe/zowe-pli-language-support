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
//// PROC1:
//// PROC2:
//// PROC3: PROCEDURE RETURNS(FIXED); END;
//// DCL A FIXED;
//// A = <|1>PROC1();
//// A = <|2>PROC2();
//// A = <|3>PROC3();

const commonHoverContent =
  hover.codeBlock(`PROC1:
 PROC2:
 PROC3: PROCEDURE RETURNS(FIXED); END;`) +
  `
---
Description :)`;
hover.expectMarkdownAt(1, commonHoverContent);
hover.expectMarkdownAt(2, commonHoverContent);
hover.expectMarkdownAt(3, commonHoverContent);
