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

//// MAIN: PROC OPTIONS(MAIN);
////   DCL <|VAR1|> FIXED;
////   DCL <|VAR2|> FIXED;
////   VAR1 = 100;
////   VAR2 = 200;
////   PUT SKIP LIST(VAR1, VAR2);
//// END MAIN;

// Test 1: Code action endpoint responds to requests
// The endpoint should respond successfully even if no code actions are available
await server.codeActions.expectAt("VAR1");
await server.codeActions.expectAt("VAR2");

// Test 2: Code action endpoint responds to source action requests
// This exercises the source action branch in connection-handler.ts.
await server.codeActions.expectAt("VAR1", "source.fixAll", 0);
await server.codeActions.expectAt("VAR2", "source.fixAll", 0);
