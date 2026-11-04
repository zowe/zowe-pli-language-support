/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../../framework.ts" />

// `TRACE();` passes a null argument, so PARMSET(VARS) is '0'B and the ELSE branch
// supplies a default. Otherwise the generated call would end in `,);`.

//// %TRACE: PROC (VARS) STATEMENT;
////   DCL VARS CHAR NOSCAN;
////   DCL TXT CHAR NOSCAN;
////   IF PARMSET(VARS)
////   THEN TXT = VARS;
////   ELSE TXT = "''";
////   ANS("CALL FWK_TRACE('>'," || TXT || ");") SKIP;
//// %END;
//// %ACTIVATE TRACE;
//// TRACE();
//// TRACE;
//// TRACE(X);

preprocessor.expectTokens(`
  CALL FWK_TRACE('>','');
  CALL FWK_TRACE('>','');
  CALL FWK_TRACE('>',X);
`);
