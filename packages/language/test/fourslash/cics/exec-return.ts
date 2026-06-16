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

//// DCL COMMAREA AREA;
//// DCL AREA AREA;
//// EXEC CICS RETURN;
//// EXEC CICS RETURN TRANSID('SSC1') COMMAREA(COMMAREA);
//// EXEC CICS RETURN TRANSID('SSC1') COMMAREA(COMMAREA) LENGTH(100);
//// EXEC CICS RETURN TRANSID('SSP1') CHANNEL("NAME");
//// EXEC CICS RETURN TRANSID('SSP1') IMMEDIATE;
//// EXEC CICS RETURN INPUTMSG(AREA);
//// EXEC CICS RETURN INPUTMSG(AREA) INPUTMSGLEN(32500);
//// EXEC CICS RETURN ENDACTIVITY;
//// EXEC CICS RETURN TRANSID('SSP2') COMMAREA(COMMAREA);
//// EXEC CICS RETURN TRANSID('SSP3') COMMAREA(COMMAREA);
//// EXEC CICS RETURN TRANSID('SSP4') COMMAREA(COMMAREA);

verify.noDiagnostics();
