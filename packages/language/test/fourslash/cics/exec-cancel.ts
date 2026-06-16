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
//// DCL NAME CHAR(8) INITIAL('NAME');
//// EXEC CICS CANCEL;
//// EXEC CICS CANCEL REQID(ID);
//// EXEC CICS CANCEL REQID(ID) SYSID(NAME);
//// EXEC CICS CANCEL REQID(ID) TRANSID(NAME);
//// EXEC CICS CANCEL ACTIVITY(NAME);
//// EXEC CICS CANCEL ACQACTIVITY;
//// EXEC CICS CANCEL ACQPROCESS;

//should only get warnings
verify.noDiagnostics();