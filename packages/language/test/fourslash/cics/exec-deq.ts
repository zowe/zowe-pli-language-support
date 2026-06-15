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
//// DCL LEN FIXED INITIAL(0);
//// EXEC CICS DEQ RESOURCE(NAME);
//// EXEC CICS DEQ RESOURCE(NAME) LENGTH(LEN);
//// EXEC CICS DEQ RESOURCE(NAME) UOW;
//// EXEC CICS DEQ RESOURCE(NAME) MAXLIFETIME(LEN);
//// EXEC CICS DEQ RESOURCE(NAME) TASK;

//should only get warnings
verify.noDiagnostics();