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

// Forward GOTO to an implicitly declared label array, with a dimensioned
// label prefix directly on the END statement.

//// AVERAGE: PROCEDURE OPTIONS (MAIN);
////   GOTO <|TEST_LABEL>TEST_LABEL(2);
////   <|TEST_LABEL|>(1): PUT("HELLO");
////   TEST_LABEL(2): END AVERAGE;

verify.noParserDiagnostics();
linker.expectLinks();
