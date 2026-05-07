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

// @filename: helper.pli
//// HELPER: PROC;
////   DCL RESULT FIXED BIN(31);
////   RESULT = 42;
////   RETURN;
//// END HELPER;

// @filename: main.pli
//// %INCLUDE HELPER;
////
//// MAIN: PROC OPTIONS(MAIN);
////   DCL P BIN FIXED;
////   DCL 1 X,
////         2 Y1,
////           3 <|z_decl1:Z|> FIXED,
////         2 Y2,
////           3 <|z_decl2:Z|> FIXED,
////         2 Y3 (P REFER(<|ambiguous:Z|>));
////
////   CALL HELPER;
//// END MAIN;

// Test 1: Verify ambiguous reference diagnostic in main.pli
verify.expectDiagnosticsAt("ambiguous", code.Severe.IBM1881I);

// Test 2: No diagnostics at declaration sites
verify.noDiagnostics("z_decl1", code.Severe.IBM1881I);
verify.noDiagnostics("z_decl2", code.Severe.IBM1881I);

// Test 3: Verify linker works across files
linker.expectLinks();

// Test 4: Code actions work in multi-file context
// Even though helper.pli is loaded, code actions in main.pli should work correctly
const actions = await server.codeActions.getAt("ambiguous", "quickfix");
if (actions.length > 0) {
  // Apply the code action to fix the ambiguous reference in main.pli
  await server.codeActions.apply(actions[0]);

  // Verify the diagnostic is removed in main.pli via LSP server
  await server.verify.noDiagnostics("ambiguous", code.Severe.IBM1881I);
}
