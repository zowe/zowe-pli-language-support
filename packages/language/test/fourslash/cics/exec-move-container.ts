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

//// DCL NAME CHAR(8) INITIAL('NAME');
//// DCL NEWNAME CHAR(8) INITIAL('NEWNAME');
//// DCL ACT FIXED INITIAL(0);
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME);
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) FROMPROCESS;
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) FROMACTIVITY(ACT);
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) TOPROCESS;
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) TOACTIVITY(ACT);
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) CHANNEL('CHAN');
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) TOCHANNEL('CHAN');
//// EXEC CICS MOVE CONTAINER(NAME) AS(NEWNAME) CHANNEL('CHAN')
////      TOCHANNEL('CHAN2');

//should only get warnings
verify.noDiagnostics();
