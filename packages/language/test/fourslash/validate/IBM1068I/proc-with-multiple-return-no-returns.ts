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
 * Procedure with several RETURN statements but no RETURNS attribute must trigger IBM1068I
 */

// @wrap: main
//// e: <|1:proc|>;
////   return(0);
////   return(1);
//// end;

verify.expectExclusiveErrorCodesAt(1, code.Information.IBM1068I.fullCode);
