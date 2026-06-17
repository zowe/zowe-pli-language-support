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
//// DCL CHAR4 CHAR(4) INITIAL('ID');
//// DCL CHAR16 CHAR(16) INITIAL('0');
//// DCL BIN31 FIXED BIN(31) INITIAL(0);
//// EXEC CICS FREE;
//// EXEC CICS FREE CHILD(CHAR16);
//// EXEC CICS FREE CONVID(CHAR4);
//// EXEC CICS FREE STATE(BIN31);
//// EXEC CICS FREE SESSION(CHAR4);

verify.noDiagnosticsFrom(languages.Cics);
