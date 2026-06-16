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
//// DCL AREA2 CHAR(16) INITIAL('0');
//// DCL VALUE CHAR(16) INITIAL('0');
//// DCL VALUE2 FIXED BIN(31) INITIAL(0);
//// DCL PAGE CHAR(40) INITIAL('0');
//// EXEC CICS PUT CONTAINER('VALUE') FROM(AREA);
//// EXEC CICS PUT CONTAINER('VALUE') ACTIVITY(VALUE) FROM(AREA2);
//// EXEC CICS PUT CONTAINER('VALUE') ACQACTIVITY FROM(AREA2);
//// EXEC CICS PUT CONTAINER('VALUE') PROCESS FROM(AREA);
//// EXEC CICS PUT CONTAINER('VALUE') ACQPROCESS FROM(AREA);
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA);
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA) BIT;
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA) CHAR;
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA)
////      DATATYPE(VALUE2);
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA)
////      FROMCCSID(VALUE2);
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA)
////      FROMCODEPAGE(PAGE);
//// EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA) APPEND;
//// // only for 6.2
//// // EXEC CICS PUT CONTAINER('VALUE') CHANNEL('CHAN') FROM(AREA) PREPEND;

verify.noDiagnostics();
