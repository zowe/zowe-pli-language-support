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

//// DCL FILENAME CHAR(8) INITIAL('FILE');
//// DCL AREA FIXED INITIAL(0);
//// DCL TOK FIXED BIN(31) INITIAL(0);
//// DCL LEN FIXED BIN(15) INITIAL(0);
//// DCL ID CHAR(4) INITIAL('    ');
//// EXEC CICS REWRITE FILE(FILENAME) FROM(AREA);
//// EXEC CICS REWRITE FILE(FILENAME) TOKEN(TOK) FROM(AREA);
//// EXEC CICS REWRITE FILE(FILENAME) FROM(AREA) SYSID(ID) LENGTH(LEN);
//// EXEC CICS REWRITE FILE(FILENAME) FROM(AREA) LENGTH(LEN);
//// EXEC CICS REWRITE FILE(FILENAME) FROM(AREA) NOSUSPEND;

verify.noDiagnostics();
