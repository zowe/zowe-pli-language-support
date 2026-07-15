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

/// <reference path="../../framework.ts" />

/**
 * A mutual `EXEC SQL INCLUDE` cycle (A includes B, B includes A) is blocked at the edge
 * that closes the cycle - B's include of its ancestor A raises the unresolved-include
 * diagnostic - instead of recursing without bound. Both files' declarations still make it
 * into the generated text once.
 */

// @filename: cpy/cyca.pli
//// DCL A_VAR FIXED;
//// EXEC SQL INCLUDE cycb;

// @filename: cpy/cycb.pli
//// DCL B_VAR FIXED;
//// <|inc:EXEC SQL INCLUDE cyca;|>

// @filename: main.pli
//// EXEC SQL INCLUDE cyca;

verify.expectDiagnosticsAt("inc", code.Severe.IBM1848I);
preprocessor.expectTokens(`
  DCL A_VAR FIXED;
  DCL B_VAR FIXED;
`);
