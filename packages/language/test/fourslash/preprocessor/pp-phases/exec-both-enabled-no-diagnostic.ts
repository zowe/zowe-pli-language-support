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

/// <reference path="../../framework.ts" />

// With both CICS and SQL configured (the default PP(MACRO SQL CICS)), neither statement
// is left unresolved, so the pipeline's final unresolved-EXEC check never fires.

//// TEST: PROCEDURE OPTIONS (MAIN);
////   EXEC SQL BEGIN DECLARE SECTION;
////     DCL EMPNO CHAR(6);
////   EXEC SQL END DECLARE SECTION;
////   EXEC CICS ABEND ABCODE('$CAN');
//// END TEST;

verify.noDiagnostics();
