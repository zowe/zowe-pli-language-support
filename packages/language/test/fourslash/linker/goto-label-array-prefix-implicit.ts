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

// Without a `DCL ... LABEL` declaration, the dimensioned label prefixes
// act as implicit declarations of the label array.

// @wrap: main
//// <|TEST_LABEL|>(1): PUT("HELLO");
//// TEST_LABEL(2): PUT("WORLD");
//// GOTO <|TEST_LABEL>TEST_LABEL(1);

verify.noParserDiagnostics();
linker.expectLinks();
