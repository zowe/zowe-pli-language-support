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

//// DCL TIME FIXED;
//// DCL FILENAME CHAR(8) INITIAL('FILE');
//// DCL AREA FIXED INITIAL(0);
//// DCL ID FIXED INITIAL(0);
//// DCL ID2 CHAR(4) INITIAL('    ');
//// DCL LEN FIXED BIN(15)INITIAL(0);
//// EXEC CICS WRITE FILE(FILENAME) FROM(AREA) RIDFLD(ID);
//// EXEC CICS WRITE FILE(FILENAME) MASSINSERT FROM(AREA) RIDFLD(ID);
//// EXEC CICS WRITE FILE(FILENAME) FROM(AREA) RIDFLD(ID) KEYLENGTH(LEN);
//// EXEC CICS WRITE FILE(FILENAME) FROM(AREA) RIDFLD(ID) SYSID(ID2)
////      LENGTH(LEN) RBA;
//// EXEC CICS WRITE FILE(FILENAME) FROM(AREA) RIDFLD(ID) LENGTH(LEN);
//// EXEC CICS WRITE FILE(FILENAME) FROM(AREA) RIDFLD(ID) NOSUSPEND;

verify.noDiagnostics();
