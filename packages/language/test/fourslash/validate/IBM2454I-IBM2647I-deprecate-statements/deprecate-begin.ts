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

////*PROCESS DEPRECATE(STMT(BEGIN));
//// TEST: PROC OPTIONS(MAIN);
////   <|1:BEGIN|>;
////     DCL X FIXED BIN(31);
////   END;
//// END TEST;

verify.expectDiagnosticsAt(1, code.Error.IBM2454I);
