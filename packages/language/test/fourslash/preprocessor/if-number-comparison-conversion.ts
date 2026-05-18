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

// @compiler: skip
//// %A = 12;
//// %IF A = "12" %THEN DO;
////   CORRECT
//// %END;
//// %ELSE DO;
////   ERROR
//// %END;

preprocessor.expectTokens("CORRECT");
