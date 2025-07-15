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
 * A nested assignment should not be handled as an implicit declaration if there are explicit declarations in the scope.
 */

// @wrap: main
//// DCL 1 <|1:A|> CHAR(10) VALUE("123");
//// MY_PROC: PROC;
////   <|1>A = 123;
////   PUT(<|1>A);
//// END MY_PROC;
//// CALL MY_PROC; // Avoid unused label warning
//// PUT(<|1>A);

verify.noDiagnostics();
linker.expectLinks();
