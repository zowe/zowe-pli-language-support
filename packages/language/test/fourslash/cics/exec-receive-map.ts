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

//// DCL AREA FIXED INITIAL(0);
//// DCL LEN FIXED INITIAL(0);
//// DCL PTR POINTER;
//// DCL NAME CHAR(8) INITIAL('NAME');
//// DCL NAMEI CHAR(8) INITIAL('NAME');
//// EXEC CICS RECEIVE MAP('NAME');
//// EXEC CICS RECEIVE MAP('NAME') INTO(AREA);
//// EXEC CICS RECEIVE MAP('NAME') SET(PTR);
//// EXEC CICS RECEIVE MAP('NAME') TERMINAL;
//// EXEC CICS RECEIVE MAP('NAME') FROM(AREA);
//// EXEC CICS RECEIVE MAP('NAME') FROM(AREA) LENGTH(LEN);
//// EXEC CICS RECEIVE MAP('NAME') TERMINAL ASIS;
//// EXEC CICS RECEIVE MAP('NAME') TERMINAL INPARTN(NAME);

//should only get warnings
verify.noDiagnostics();