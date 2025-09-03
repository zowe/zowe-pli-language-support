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
 Preprocessor variables can be linked from PL/I code.
 */
//// %<|1:TEST|>: PROC RETURNS (CHAR);
////   RETURN ("VALUE");
//// %END;
//// %ACTIVATE TEST;
//// <|1>TEST

linker.expectLinks();
