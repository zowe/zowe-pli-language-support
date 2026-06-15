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

//// DCL PTR POINTER;
//// DCL DATA FIXED INITIAL(0);
//// DCL LEN FIXED INITIAL(0);
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN);
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) INITIMG(DATA);
//// EXEC CICS GETMAIN SET(PTR) FLENGTH(LEN);
//// EXEC CICS GETMAIN SET(PTR) FLENGTH(LEN) BELOW;
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) EXECUTABLE;
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) SHARED;
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) NOSUSPEND;
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) USERDATAKEY;
//// EXEC CICS GETMAIN SET(PTR) LENGTH(LEN) CICSDATAKEY;

//should only get warnings
verify.noDiagnostics();