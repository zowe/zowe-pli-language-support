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

// An explicit declaration of a LABEL variable counts as a repetition
// when the same variable name is used for a label prefix

// @wrap: main
//// DCL <|TEST_VALUE|> LABEL;
//// TEST_VALUE: PUT("HELLO WORLD");

verify.expectDiagnosticsAt("TEST_VALUE", code.Error.IBM1306I);
