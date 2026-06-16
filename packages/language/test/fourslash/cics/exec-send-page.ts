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

//// DCL ID FIXED INITIAL(0);
//// DCL AREA FIXED INITIAL(0);
//// DCL PTR POINTER;
//// DCL NAME CHAR(8) INITIAL('NAME');
//// EXEC CICS SEND PAGE;
//// EXEC CICS SEND PAGE RELEASE TRANSID(ID);
//// EXEC CICS SEND PAGE RETAIN;
//// EXEC CICS SEND PAGE TRAILER(AREA);
//// EXEC CICS SEND PAGE SET(PTR);
//// EXEC CICS SEND PAGE AUTOPAGE;
//// EXEC CICS SEND PAGE AUTOPAGE CURRENT;
//// EXEC CICS SEND PAGE AUTOPAGE ALL;
//// EXEC CICS SEND PAGE NOAUTOPAGE;
//// EXEC CICS SEND PAGE OPERPURGE;
//// EXEC CICS SEND PAGE FMHPARM(NAME);
//// EXEC CICS SEND PAGE LAST;

//should only get warnings
verify.noDiagnostics();
