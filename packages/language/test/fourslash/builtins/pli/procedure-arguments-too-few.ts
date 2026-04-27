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

//// XXX: PROC(A, B);
////    DCL A FIXED;
////    DCL B FIXED;
//// END XXX;
//// START: PROC RETURNS(FIXED);
////   CALL <|XXX|>(1);
////   RETURN(0);
//// END START;

verify.expectDiagnosticsAt("XXX", code.Warning.IBM3323I);
