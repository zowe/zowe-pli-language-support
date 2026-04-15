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

//// XXX: PROC(LS) OPTIONS(NODESCRIPTOR) RETURNS(FIXED);
////  DCL LS FIXED LIST;
////  RETURN(0);
//// END XXX;
//// main: PROCEDURE() OPTIONS(MAIN);
////  DCL A FIXED;
////  A = <|XXX|>(12, 3)(1,2,3);
//// END main;

verify.expectDiagnosticsAt("XXX", code.Severe.IBM1704I);
