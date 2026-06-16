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

//// DCL Q CHAR(8) INITIAL('Q');
//// DCL NAME FIXED INITIAL(0);
//// EXEC CICS DELETEQ TD QUEUE(Q) SYSID(NAME);
//// EXEC CICS DELETEQ TS QNAME(Q);
//// EXEC CICS DELETEQ TS QUEUE(Q);
//// EXEC CICS DELETEQ TS QUEUE(Q) SYSID(NAME);

//should only get warnings
verify.noDiagnostics();
