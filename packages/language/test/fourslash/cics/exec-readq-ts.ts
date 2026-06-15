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

//// DCL QAREA FIXED;
//// DCL NAREA FIXED;
//// DCL NAME CHAR(8);
//// DCL VALUE CHAR(8);
//// DCL LEN FIXED;
//// DCL ID FIXED;
//// DCL PTR POINTER;
//// EXEC CICS READQ TS QNAME(NAME) INTO(QAREA);
//// EXEC CICS READQ TS QUEUE(NAME) SET(PTR) LENGTH(LEN);
//// EXEC CICS READQ TS QNAME(NAME) INTO(QAREA) NUMITEMS(NAREA);
//// EXEC CICS READQ TS QNAME(NAME) INTO(QAREA) NEXT;
//// EXEC CICS READQ TS QNAME(NAME) INTO(QAREA) ITEM(VALUE);
//// EXEC CICS READQ TS QNAME(NAME) INTO(QAREA) SYSID(ID); 

//should only get warnings
verify.noDiagnostics();