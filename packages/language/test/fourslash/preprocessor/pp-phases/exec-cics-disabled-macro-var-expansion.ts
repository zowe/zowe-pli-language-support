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

// Even though CICS is excluded from PP(...) here (so the EXEC CICS statement's tokens are
// preserved unchanged rather than processed), macro variable references embedded in the
// preserved ExecFragment text must still be expanded by the MACRO phase.

// @wrap: process
////*PROCESS PP(MACRO);
//// %DCL CODEVAR CHAR;
//// %CODEVAR = '''$CAN''';
//// %DO;
////   EXEC CICS ABEND ABCODE(CODEVAR);
//// %END;

preprocessor.containsTokens(["CICS ABEND ABCODE('$CAN')"]);
