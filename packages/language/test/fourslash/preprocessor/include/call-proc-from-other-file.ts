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

// @filename: cpy/lib.pli
//// %TEST_PROC: PROC (INPUT) STATEMENT;
////   ANS(INPUT || " OUTPUT");
//// %END;
//// %ACT TEST_PROC;

// @filename: main.pli
//// %INCLUDE LIB;
//// TEST_PROC(TEST);

preprocessor.expectTokens("TEST OUTPUT");
