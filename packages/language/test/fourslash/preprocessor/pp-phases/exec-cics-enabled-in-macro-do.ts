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

// With the default PP(MACRO SQL CICS), an EXEC CICS statement nested inside a plain %DO
// block must still be fully expanded (DO;END; plus DFHEIBLK declarations), with no
// diagnostics.

//// TEST: PROC;
////   %DO;
////     EXEC CICS ABEND ABCODE('$CAN');
////   %END;
//// END;

preprocessor.containsTokens([
  "TEST",
  ":",
  "PROC",
  ";",
  "DCL",
  "DFHEIBLK",
  "BASED",
  "(",
  "DFHEIPTR",
  ")",
  "DO",
  ";",
  "END",
  ";",
  "END",
  ";",
]);
verify.noDiagnostics();
