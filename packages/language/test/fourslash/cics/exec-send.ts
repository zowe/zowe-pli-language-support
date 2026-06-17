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
//// DECLARE PTR POINTER;
//// DECLARE AREA AREA;
//// DECLARE DATA AREA;
//// DECLARE ID CHAR(8) INITIAL('1');
//// DECLARE ID2 FIXED BIN(15) INITIAL(1);
//// DECLARE ALLOCATED FIXED BIN(31) INITIAL(0);
//// DECLARE X CHAR;
//// DECLARE NAME CHAR(4) INITIAL('HELL');
//// DECLARE NAME2 CHAR(2) INITIAL('HE');
//// DECLARE FILE FILE;
//// EXEC CICS SEND CONVID(NAME);
//// EXEC CICS SEND FROM(DATA) LENGTH(0);
//// EXEC CICS SEND FROM(DATA) FLENGTH(100);
//// EXEC CICS SEND CONFIRM;
//// EXEC CICS SEND WAIT;
//// EXEC CICS SEND STATE(ALLOCATED);
//// EXEC CICS SEND INVITE;
//// EXEC CICS SEND LAST;
//// EXEC CICS SEND ERASE;
//// EXEC CICS SEND ERASE DEFAULT;
//// EXEC CICS SEND ERASE ALTERNATE;
//// EXEC CICS SEND CTLCHAR(X);
//// EXEC CICS SEND STRFIELD;
//// EXEC CICS SEND DEFRESP;
//// EXEC CICS SEND CNOTCOMPL;
//// EXEC CICS SEND FROM(AREA) LENGTH(100) FMH;
//// EXEC CICS SEND SESSION(NAME);
//// EXEC CICS SEND ATTACHID(ID);
//// EXEC CICS SEND LDC(NAME2);
//// EXEC CICS SEND LINEADDR(ID2);
//// EXEC CICS SEND LEAVEKB;

verify.noDiagnosticsFrom(languages.Cics);
