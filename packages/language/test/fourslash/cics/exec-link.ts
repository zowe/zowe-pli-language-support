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

//// DCL DFHCOMMAREA AREA;
//// DCL AREA AREA;
//// DCL SYSID CHAR(4) INIT('SYS1');
//// DCL TRANSID CHAR(4) INIT('TRID');
//// EXEC CICS LINK PROGRAM('AAAAAAAA');
//// EXEC CICS LINK PROGRAM('AAAAAAAA') COMMAREA(DFHCOMMAREA);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') COMMAREA(DFHCOMMAREA)
////   LENGTH(32500);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') COMMAREA(DFHCOMMAREA)
////   DATALENGTH(32500);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') CHANNEL('CHAN');
//// EXEC CICS LINK PROGRAM('AAAAAAAA') INPUTMSG(AREA);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') INPUTMSG(AREA)
////   INPUTMSGLEN(32500);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') SYSID(SYSID);
//// EXEC CICS LINK PROGRAM('AAAAAAAA') SYNCONRETURN;
//// EXEC CICS LINK PROGRAM('AAAAAAAA') TRANSID(TRANSID);

verify.noDiagnostics();
