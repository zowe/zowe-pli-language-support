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
//// EXEC CICS DELETE CONTAINER(NAME);
//// EXEC CICS DELETE CONTAINER(NAME) ACTIVITY(1);
//// EXEC CICS DELETE CONTAINER(NAME) ACQACTIVITY;
//// EXEC CICS DELETE CONTAINER(NAME) PROCESS;
//// EXEC CICS DELETE CONTAINER(NAME) ACQPROCESS;
//// EXEC CICS DELETE CONTAINER(NAME) CHANNEL('CHAN');

//should only get warnings
verify.noDiagnostics();