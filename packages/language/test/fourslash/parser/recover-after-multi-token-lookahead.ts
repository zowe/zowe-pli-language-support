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

//// DEFINE <|TEST|>;

// Verify that the parser displays an error message at the position of the token TEST
// Indirectly ensures that the parser recovers without an infinite loop.
verify.expectDiagnosticsAt("TEST", {
  severity: constants.Severity.S,
});
