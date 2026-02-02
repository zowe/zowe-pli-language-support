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

// @wrap: main
//// DCL ENTRY_TABLE_COUNT FIXED BIN(31) INIT(10);
//// DCL I FIXED BIN(31);
//// DCL ENTRY(ENTRY_TABLE_COUNT) FIXED BIN(31);
//// PUT SKIP(2) EDIT
////   ((I, ENTRY(I) DO I = 0 TO ENTRY_TABLE_COUNT))
////   (SKIP, F(4), X(1), A(33), A(8), (5) F(6), X(1), A, X(1), A);

verify.noParserDiagnostics();
