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

//// DECLARE PTR POINTER;
//// DECLARE AREA AREA;
//// DECLARE DATA AREA;
//// DECLARE ID FIXED INITIAL(1);
//// DECLARE ALLOCATED FIXED INITIAL(0);
//// DECLARE X CHAR;
//// DECLARE NAME CHAR(10) INITIAL('HELLO');
//// DECLARE FILE FILE;
//// EXEC CICS RECEIVE;
//// EXEC CICS RECEIVE INTO(FILE) LENGTH(ID);
//// EXEC CICS RECEIVE SET(PTR) LENGTH(ID);
//// EXEC CICS RECEIVE SET(PTR) LENGTH(ID);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(ID);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(ID) MAXLENGTH(200);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(ID) MAXFLENGTH(200);
//// EXEC CICS RECEIVE NOTRUNCATE;
//// EXEC CICS RECEIVE CONVID(NAME);
//// EXEC CICS RECEIVE STATE(NAME);
//// EXEC CICS RECEIVE ASIS BUFFER LEAVEKB PASSBK;
//// EXEC CICS RECEIVE SESSION(NAME);
//// EXEC CICS RECEIVE INTO(FILE) LENGTH(ID) RESP(ID);

//should only get warnings
verify.noDiagnostics();
