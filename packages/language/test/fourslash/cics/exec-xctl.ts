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

//// DCL DFHCOMMAREA FIXED INITIAL(0);
//// DCL AREA FIXED INITIAL(0);
//// DCL LEN FIXED BIN(15) INITIAL(0);
//// EXEC CICS XCTL PROGRAM('AAAAAAAA');
//// EXEC CICS XCTL PROGRAM('AAAAAAAA') COMMAREA(DFHCOMMAREA);
//// EXEC CICS XCTL PROGRAM('AAAAAAAA') COMMAREA(DFHCOMMAREA) LENGTH(LEN);
//// EXEC CICS XCTL PROGRAM('AAAAAAAA') CHANNEL('CHAN');
//// EXEC CICS XCTL PROGRAM('AAAAAAAA') INPUTMSG(AREA);
//// EXEC CICS XCTL PROGRAM('AAAAAAAA') INPUTMSG(AREA) INPUTMSGLEN(LEN);

verify.noDiagnostics();
