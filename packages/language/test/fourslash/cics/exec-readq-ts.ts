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

// @compiler: true
// @wrap: main
//// DCL QAREA FIXED BIN(15) INIT(0);
//// DCL NAREA FIXED BIN(15) INIT(0);
//// DCL NAME CHAR(8) INIT('MYQUEUE');
//// DCL LONGNAME CHAR(16) INIT('MYQUEUE2');
//// DCL VALUE FIXED BIN(15) INIT(0);
//// DCL LEN FIXED BIN(15) INIT(0);
//// DCL ID CHAR(4) INIT('    ');
//// DCL PTR POINTER;
//// EXEC CICS READQ TS QNAME(LONGNAME) INTO(QAREA);
//// EXEC CICS READQ TS QUEUE(NAME) SET(PTR) LENGTH(LEN);
//// EXEC CICS READQ TS QNAME(LONGNAME) INTO(QAREA) NUMITEMS(NAREA);
//// EXEC CICS READQ TS QNAME(LONGNAME) INTO(QAREA) NEXT;
//// EXEC CICS READQ TS QNAME(LONGNAME) INTO(QAREA) ITEM(VALUE);
//// EXEC CICS READQ TS QNAME(LONGNAME) INTO(QAREA) SYSID(ID);

verify.noDiagnosticsFrom(languages.Cics);
