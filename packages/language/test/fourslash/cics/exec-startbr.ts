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
//// DCL SYSTEMNAME CHAR(4) INITIAL('NAME');
//// DCL AREA FIXED INITIAL(0);
//// DCL VALUE FIXED BIN(15) INITIAL(0);
//// DCL LEN FIXED BIN(15) INITIAL(0);
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA);
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) KEYLENGTH(LEN);
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) KEYLENGTH(LEN) GENERIC;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) REQID(VALUE)
////      SYSID(SYSTEMNAME) RRN;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) DEBKEY;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) DEBREC;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) RBA;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) RRN;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) XRBA;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) GTEQ;
//// EXEC CICS STARTBR FILE(NAME) RIDFLD(AREA) XRBA EQUAL;

verify.noDiagnostics();
