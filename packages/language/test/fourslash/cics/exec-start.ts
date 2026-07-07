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
//// DCL ID CHAR(4) INITIAL('0');
//// DCL ID2 CHAR(16) INITIAL('0');
//// DCL ID3 FIXED DEC(7) INITIAL(0);
//// DCL AREA FIXED;
//// DCL VALUE FIXED;
//// DCL CHAR4 CHAR(4) INITIAL('0');
//// DCL CHAR8 CHAR(8) INITIAL('0');
//// EXEC CICS START TRANSID('TID') CHANNEL('CHAN') TERMID(ID);
//// EXEC CICS START TRANSID('TID') CHANNEL('CHAN') USERID(CHAR8)
////    SYSID(CHAR4);
//// EXEC CICS START TRANSID('TID');
//// EXEC CICS START TRANSID('TID') INTERVAL(0);
//// EXEC CICS START TRANSID('TID') INTERVAL(123);
//// EXEC CICS START TRANSID('TID') TIME(123);
//// EXEC CICS START TRANSID('TID') AFTER HOURS(1) MINUTES(30)
////    SECONDS(45);
//// EXEC CICS START TRANSID('TID') AT HOURS(1) MINUTES(30)
////    SECONDS(45);
//// EXEC CICS START TRANSID('TID') FROM(AREA) LENGTH(100);
//// EXEC CICS START TRANSID('TID') FROM(AREA) LENGTH(100) FMH;
//// EXEC CICS START TRANSID('TID') TERMID('name');
//// EXEC CICS START TRANSID('TID') USERID(CHAR8);
//// EXEC CICS START TRANSID('TID') SYSID(CHAR4);
//// EXEC CICS START TRANSID('TID') RTRANSID(CHAR4);
//// EXEC CICS START TRANSID('TID') RTERMID(CHAR4);
//// EXEC CICS START TRANSID('TID') QUEUE(CHAR8);
//// EXEC CICS START TRANSID('TID') NOCHECK;
//// EXEC CICS START TRANSID('TID') PROTECT;

verify.noDiagnosticsFrom(languages.Cics);
