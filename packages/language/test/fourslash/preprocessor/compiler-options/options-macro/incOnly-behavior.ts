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

/// <reference path="../../../framework.ts" />

// @filename: cpy/lib.pli
//// DCL LIB_VAR FIXED;

// @filename: main.pli
////*PROCESS PP(MACRO("INCONLY"));
//// %DECLARE X FIXED;
//// %X = 123;
//// %INCLUDE lib;
//// %ACTIVATE X;
//// %DO I = 1 TO 10;
////   DCL VAR%;I FIXED;
//// %END;
//// %IF 1 %THEN DO;
////   DCL Y FIXED;
//// %END;

// When incOnly is active, all preprocessor statements except INCLUDE and INSCAN
// should be passed through unchanged (as token statements)
preprocessor.expectTokens(`
  %DECLARE X FIXED;
  %X = 123;
  DCL LIB_VAR FIXED;
  %ACTIVATE X;
  %DO I = 1 TO 10;
    DCL VAR%;I FIXED;
  %END;
  %IF 1 %THEN DO;
    DCL Y FIXED;
  %END;
`);
