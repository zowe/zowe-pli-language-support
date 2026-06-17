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
//// DECLARE BIN31 FIXED BIN(31) INITIAL(0);
//// DECLARE PTR POINTER;
//// DECLARE AREA AREA;
//// DECLARE DATA AREA;
//// DECLARE LEN FIXED BIN(15) INITIAL(1);
//// DECLARE LEN2 FIXED BIN(31) INITIAL(1);
//// DECLARE ALLOCATED FIXED INITIAL(0);
//// DECLARE X CHAR;
//// DECLARE NAME CHAR(4) INITIAL('HELL');
//// DECLARE FILE FILE;
//// EXEC CICS RECEIVE;
//// EXEC CICS RECEIVE INTO(FILE) LENGTH(LEN);
//// EXEC CICS RECEIVE SET(PTR) LENGTH(LEN);
//// EXEC CICS RECEIVE SET(PTR) LENGTH(LEN);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(LEN2);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(LEN2) MAXLENGTH(200);
//// EXEC CICS RECEIVE SET(PTR) FLENGTH(LEN2) MAXFLENGTH(200);
//// EXEC CICS RECEIVE NOTRUNCATE;
//// EXEC CICS RECEIVE CONVID(NAME);
//// EXEC CICS RECEIVE STATE(BIN31);
//// EXEC CICS RECEIVE ASIS BUFFER LEAVEKB;
//// EXEC CICS RECEIVE SESSION(NAME) PASSBK;

verify.noDiagnosticsFrom(languages.Cics);
