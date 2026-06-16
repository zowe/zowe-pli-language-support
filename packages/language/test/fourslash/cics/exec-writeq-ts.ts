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

//// DECLARE QAREA FIXED;
//// DECLARE NAME CHAR(8);
//// DECLARE MSG CHAR(8);
//// DECLARE DATAAREA FIXED;
//// DECLARE SYSNAME CHAR(8);
//// EXEC CICS WRITEQ TD QUEUE(NAME) FROM(QAREA);
//// EXEC CICS WRITEQ TD QUEUE(NAME) FROM(QAREA) LENGTH(100);
//// EXEC CICS WRITEQ TS QUEUE(NAME) FROM(QAREA);
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA);
//// EXEC CICS WRITEQ TS QUEUE(NAME) FROM(QAREA) LENGTH(100);
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) NUMITEMS(QAREA);
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) ITEM(DATAAREA);
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) ITEM(DATAAREA) REWRITE;
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) SYSID(SYSNAME);
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) AUXILIARY;
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) MAIN;
//// EXEC CICS WRITEQ TS QNAME(NAME) FROM(QAREA) NOSUSPEND;

//should only get warnings
verify.noDiagnostics();
