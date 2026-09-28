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

// `DFHVALUE(cvda)` is a CICS-value data area name; like `DFHRESP` the translator
// substitutes the numeric value, so the comparison is plain arithmetic to the parser.

//// TEST: PROC;
////   DCL STATUS FIXED BIN(31);
////   EXEC CICS INQUIRE FILE('MYFILE') OPENSTATUS(STATUS);
////   IF STATUS = DFHVALUE(OPEN) THEN
////     PUT('OPEN');
////   ELSE IF STATUS = DFHVALUE(CLOSED) THEN
////     PUT('CLOSED');
//// END;

verify.noDiagnostics();
preprocessor.containsTokens(["IF", "STATUS", "=", "18", "THEN"]);
preprocessor.containsTokens(["IF", "STATUS", "=", "19", "THEN"]);
preprocessor.not.containsTokens(["DFHVALUE"]);
