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

/**
 * LEAVE inside non-iterative DO-group nested in an iterative DO should warn (IBM1219I)
 */

// @wrap: main
//// dcl n fixed bin(31);
//// dcl i fixed bin(31);
//// dcl a(32) fixed bin(31);
////
//// DO I = 1 TO N;
////   IF A(I) > 0 THEN
////     DO;
////       CALL F;
////       <|1:LEAVE|>;
////     END;
////   ELSE;
//// END;
////
verify.expectExclusiveErrorCodesAt(1, code.Warning.IBM1219I);
