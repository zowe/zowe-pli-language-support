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

//// DCL VALUE FIXED INITIAL(0);
//// DCL LEN FIXED INITIAL(0);
//// DCL DATA FIXED INITIAL(0);
//// DCL ACT FIXED INITIAL(0);
//// DCL NAME CHAR(8) INITIAL('NAME');
//// EXEC CICS WRITE OPERATOR TEXT(VALUE);
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) TEXTLENGTH(LEN);
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) ROUTECODES(100) NUMROUTES(200);
//// //TODO find out why CONSNAME is not supported on the mainframe
//// //EXEC CICS WRITE OPERATOR TEXT(VALUE) CONSNAME(NAME);
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) EVENTUAL;
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) ACTION(ACT);
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) CRITICAL;
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) IMMEDIATE;
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) REPLY(DATA) MAXLENGTH(LEN);
//// EXEC CICS WRITE OPERATOR TEXT(VALUE) REPLY(DATA) MAXLENGTH(LEN)
////      REPLYLENGTH(LEN);

//should only get warnings
verify.noDiagnostics();
