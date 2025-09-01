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
 * Procedure with RETURNS attribute and RETURN statement must NOT trigger IBM1068I
 */

// @wrap: main
//// b: proc returns(fixed);
////    if 4 > 5 then
////        return (1);
////    else
////        return (0);
//// end;

verify.noDiagnostics();
