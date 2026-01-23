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

////*PROCESS DEPRECATE(INCLUDE(B, LIB));
//// TEST: PROC OPTIONS(MAIN);
////   %<|1:INCLUDE|> "b.pli";
////   %INCLUDE "c.pli";
////   %<|2:INCLUDE|> lib;
////   %INCLUDE LIB2;
//// END TEST;

verify.expectDiagnosticsAt(1, code.Error.IBM3658I);
verify.expectDiagnosticsAt(2, code.Error.IBM3658I);
