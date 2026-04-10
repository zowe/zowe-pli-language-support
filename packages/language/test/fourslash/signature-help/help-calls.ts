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
////  * Description
////  * @param {CHARACTER} a Description of a
////  * @param {FIXED} b Description of b
////  * @param {FIXED} [c] Description of c
////  */
//// %XXX: PROC(A, B, C);
////   DECLARE A CHARACTER;
////   DECLARE B FIXED;
////   DECLARE C FIXED OPTIONAL;
//// %END;
//// %YYY: PROC;
////   CALL XXX(<|0>"abc", <|1>1, <|2>2);
//// %END;

signatureHelp.expectParameterIndexAt(0, 0);
signatureHelp.expectParameterIndexAt(1, 1);
signatureHelp.expectParameterIndexAt(2, 2);
