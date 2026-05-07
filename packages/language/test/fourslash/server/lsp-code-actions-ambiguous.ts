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

//// TEST: PROC OPTIONS(MAIN);
////   DCL P BIN FIXED;
////   DCL 1 X,
////         2 Y1,
////           3 <|decl1:Z|> FIXED,
////         2 Y2,
////           3 <|decl2:Z|> FIXED,
////         2 Y3 (P REFER(<|ambiguous:Z|>));
//// END TEST;

// Test 1: Verify that ambiguous reference diagnostic is present (TestBuilder state)
verify.expectDiagnosticsAt("ambiguous", code.Severe.IBM1881I);

// Test 2: No diagnostics at the declaration sites (TestBuilder state)
verify.noDiagnostics("decl1", code.Severe.IBM1881I);
verify.noDiagnostics("decl2", code.Severe.IBM1881I);

// Test 3: Verify code actions are available for ambiguous reference via LSP
// The IBM1881I diagnostic (ambiguous reference) should provide 2 quickfix actions
const actions = await server.codeActions.expectAt("ambiguous", "quickfix", 2);

if (actions.length > 0) {
  // Apply the first suggested fix (e.g., "Change to Y1.Z")
  await server.codeActions.apply(actions[0]);

  // Verify the ambiguous reference diagnostic is now gone via LSP server
  // This uses server.verify which checks the LSP server state after the code action
  await server.verify.noDiagnostics("ambiguous", code.Severe.IBM1881I);
} else {
  throw new Error(
    "Expected code actions for ambiguous reference, but none were found.",
  );
}
