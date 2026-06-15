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

//// DCL FILE FIXED INITIAL(0);
//// DCL PTR POINTER;
//// DCL ID FIXED INITIAL(0);
//// DCL NAME CHAR(8) INITIAL('NAME');
//// DCL AREA FIXED INITIAL(0);
//// DCL LEN FIXED INITIAL(0);
//// DCL CLICK FIXED INITIAL(0);
//// EXEC CICS RETRIEVE INTO(FILE);
//// EXEC CICS RETRIEVE SET(PTR) LENGTH(LEN);
//// EXEC CICS RETRIEVE INTO(FILE) LENGTH(LEN);
//// EXEC CICS RETRIEVE INTO(FILE) RTRANSID(ID);
//// EXEC CICS RETRIEVE INTO(FILE) RTERMID(ID);
//// EXEC CICS RETRIEVE INTO(FILE) QUEUE(NAME);
//// EXEC CICS RETRIEVE INTO(FILE) WAIT;
//// EXEC CICS RETRIEVE REATTACH EVENT(DATA) EVENTTYPE(CLICK);
//// EXEC CICS RETRIEVE SUBEVENT(AREA) EVENT(AREA) EVENTTYPE(CLICK);

//should only get warnings
verify.noDiagnostics();