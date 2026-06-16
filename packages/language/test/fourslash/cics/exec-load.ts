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

//// DCL LEN FIXED INITIAL(0);
//// DCL NAME CHAR(8) INITIAL('NAME');
//// DCL PTR POINTER;
//// EXEC CICS LOAD PROGRAM(NAME);
//// EXEC CICS LOAD PROGRAM(NAME) SET(PTR);
//// EXEC CICS LOAD PROGRAM(NAME) SET(PTR) LENGTH(LEN);
//// EXEC CICS LOAD PROGRAM(NAME) SET(PTR) FLENGTH(LEN);

//should only get warnings
verify.noDiagnostics();
