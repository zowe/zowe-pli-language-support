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

// A plain EXEC CICS statement (not embedded in any macro construct) must still be
// processed by the CICS phase: it generates the DFHEIBLK declarations once and the
// statement itself is replaced by `DO; END;`.

//// TEST: PROC;
////   EXEC CICS ABEND ABCODE('$CAN');
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
