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
//// DCL CODE CHAR(4) INITIAL('0');
//// DCL FILE FIXED INITIAL(0);
//// DCL ID CHAR(9) INITIAL('0');
//// DCL LIST FIXED BIN(31) INITIAL(0);
//// DCL LIST2 FIXED BIN(31) INITIAL(0);
//// DCL NUMS FIXED BIN(31) INITIAL(0);
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE);
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) FROM(FILE) LENGTH(100);
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) FROM(FILE) FLENGTH(100);
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) COMPLETE;
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) TRT;
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) SEGMENTLIST(LIST)
////      LENGTHLIST(LIST2) NUMSEGMENTS(NUMS);
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) TASK STORAGE PROGRAM
////      TERMINAL PCT PPT SIT TCT TABLES FCT;
//// EXEC CICS DUMP TRANSACTION DUMPCODE(CODE) DUMPID(ID);

verify.noDiagnosticsFrom(languages.Cics);
