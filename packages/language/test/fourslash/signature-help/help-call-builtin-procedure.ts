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
////  * @param INPUT Description of input parameter.
////  */
//// XXX: PROCEDURE(INPUT);
////   DCL INPUT FIXED;
//// END;
//// CALL XXX(<|1>123);

signatureHelp.expectParameterIndexAt(1, 0);
signatureHelp.expectMarkdownParameterAt(
  1,
  `\`INPUT: FIXED\`

Description of input parameter.`,
);
