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

// @compiler: true
// @wrap: main
//// DCL A FIXED BIN;
//// DCL 1 X, 2 Y FIXED BIN;
//// <|A.B|> = 1;
//// <|X.Y.Z.W|> = 1;

verify.expectExclusiveDiagnosticsAt("A.B", code.Severe.IBM1623I);
verify.expectExclusiveDiagnosticsAt("X.Y.Z.W", code.Severe.IBM1623I);
