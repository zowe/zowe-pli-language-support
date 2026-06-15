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
//// DECLARE DATA AREA;
//// DECLARE ID FIXED;
//// DECLARE FILE FILE;
//// EXEC CICS ABEND ABCODE('LGV4') NODUMP;
//// EXEC CICS ACQUIRE PROCESS('DATA') PROCESSTYPE('NAME');
//// EXEC CICS ADD SUBEVENT('EVENT') EVENT('DATA');
//// EXEC CICS ADDRESS SET(DATA) USING(PTR);
//// EXEC CICS ALLOCATE SESSION(NAME);
//// EXEC CICS ASKTIME ABSTIME(ID);
//// EXEC CICS ASSIGN ABOFFSET(ID);
//// EXEC CICS BIF DEEDIT FIELD(DATA);
//// EXEC CICS CANCEL REQID(ID);
//// EXEC CICS CHANGE PASSWORD('PW') NEWPASSWORD('NEW') USERID('ME');
//// EXEC CICS CHANGE TASK PRIORITY(1);
//// EXEC CICS CHECK TIMER(ID) STATUS(ID);
//// EXEC CICS CONNECT PROCESS CONVID(ID) PROCNAME(NAME) SYNCLEVEL(ID);
//// EXEC CICS CONVERSE FROM(FILE) FROMLENGTH(100);
//// EXEC CICS DEFINE COUNTER('NAME') POOL('2') VALUE(0) MINIMUM(0);
//// EXEC CICS DEFINE INPUT EVENT('EVENT');

verify.noDiagnostics();
