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

// @filename: main.pli
//// MAIN: PROC OPTIONS(MAIN);
////   PUT(<|1>SOME_ENTRY(42));
////   PUT(<|2>SOME_OTHER_ENTRY(42));
//// END MAIN;
//// OTHER: PROC;
//// DO;
////   <|1:SOME_ENTRY|>: ENTRY(C) RETURNS(CHAR(11) VAR);
//// END;
//// <|2:SOME_OTHER_ENTRY|>: ENTRY(C) RETURNS(CHAR(11) VAR);
//// END OTHER;

linker.expectLinks();
