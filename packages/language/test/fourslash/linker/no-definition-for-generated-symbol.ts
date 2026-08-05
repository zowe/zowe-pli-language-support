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

/**
 * `TEST_VAR` is generated via a preprocessor statement and does exist in the source code.
 * Go to definition should not be available for this symbol.
 */
////*PROCESS PP(CICS);
//// TEST: PROC;
////   %DCL SOME_VAR CHAR INIT("DCL TEST_VAR FIXED;");
////   SOME_VAR
////   IF <|1>TEST_VAR = 0 THEN;
//// END;

linker.expectNoLinksAt("1");
