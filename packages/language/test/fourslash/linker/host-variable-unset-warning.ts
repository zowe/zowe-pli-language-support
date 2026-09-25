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

// A host variable counts as being *before* the statement generated from its EXEC
// statement: used before the implicit declaration's first assignment, it still gets the
// IBM1085I "may be unset" warning.

// @compiler: true
// @wrap: main
//// EXEC SQL SELECT 1 INTO :<|1><|2:Z|> FROM T;
//// <|1:Z|> = 123;

verify.expectExclusiveErrorCodesAt(2, code.Warning.IBM1085I);
linker.expectLinks();
