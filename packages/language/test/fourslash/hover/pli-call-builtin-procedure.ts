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
////  * @param {FIXED} INPUT Description of input parameter.
////  */
//// XXX: PROCEDURE(INPUT);
////   DCL INPUT FIXED;
//// END;
//// CALL <|1>XXX(123);

const commonHoverContent =
  hover.codeBlock(`XXX: PROCEDURE(INPUT);
   DCL INPUT FIXED;
 END;`) +
  `
---
Description :)

*@param* — {FIXED} INPUT Description of input parameter.`;
hover.expectMarkdownAt(1, commonHoverContent);
