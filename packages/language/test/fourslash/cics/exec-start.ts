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

//// DCL ID FIXED;
//// DCL AREA FIXED;
//// DCL VALUE FIXED;
//// EXEC CICS START TRANSID('TID') CHANNEL('CHAN') TERMID(ID);
//// EXEC CICS START TRANSID('TID') CHANNEL('CHAN') USERID(ID) 
////    SYSID(ID);
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
//// EXEC CICS START TRANSID('TID') USERID(VALUE);
//// EXEC CICS START TRANSID('TID') SYSID(VALUE);
//// EXEC CICS START TRANSID('TID') RTRANSID(VALUE);
//// EXEC CICS START TRANSID('TID') RTERMID(VALUE);
//// EXEC CICS START TRANSID('TID') QUEUE(VALUE);
//// EXEC CICS START TRANSID('TID') NOCHECK;
//// EXEC CICS START TRANSID('TID') PROTECT;

//should only get warnings
verify.noDiagnostics();