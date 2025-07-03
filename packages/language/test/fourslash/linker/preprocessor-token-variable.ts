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
// @wrap: main
//// %DECLARE <|1:ABC|> CHARACTER;
//// %ABC = 'PAY_ROLL';
//// PUT(<|1>ABC);

linker.expectLinks();
