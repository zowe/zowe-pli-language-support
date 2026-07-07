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
//// DCL PTR POINTER;
//// DCL DATA POINTER;
//// EXEC CICS ADDRESS;
//// EXEC CICS ADDRESS ACEE(PTR);
//// EXEC CICS ADDRESS COMMAREA(PTR);
//// EXEC CICS ADDRESS CWA(PTR);
//// EXEC CICS ADDRESS TCTUA(PTR);
//// EXEC CICS ADDRESS TWA(PTR);
//// EXEC CICS ADDRESS TWA(PTR) TCTUA(PTR);
//// EXEC CICS ADDRESS SET(DATA) USING(PTR);

verify.noDiagnosticsFrom(languages.Cics);
