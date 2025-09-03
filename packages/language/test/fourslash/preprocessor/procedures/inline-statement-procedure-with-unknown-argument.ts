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

//// %TEST: PROC (INPUT) STATEMENT RETURNS (CHAR);
////   RETURN (INPUT);
//// %END;
//// %ACTIVATE TEST;
//// PREFIX TEST INPUT(123) <|1:OUTPUT|>(321); SUFFIX

preprocessor.expectTokens("PREFIX 123 SUFFIX");
verify.expectExclusiveErrorCodesAt("1", [code.Error.IBM3581I.fullCode]);
