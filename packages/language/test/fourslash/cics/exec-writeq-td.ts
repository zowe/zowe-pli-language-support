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
//// DCL QAREA FIXED INITIAL(0);
//// DCL LEN FIXED INITIAL(0);
//// EXEC CICS WRITEQ TD QUEUE(NAME) FROM(QAREA);
//// EXEC CICS WRITEQ TD QUEUE(NAME) FROM(QAREA) LENGTH(LEN);

//should only get warnings
verify.noDiagnostics();