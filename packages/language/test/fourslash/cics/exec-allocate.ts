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
////  DCL NAME CHAR(8) INITIAL('NAME');
//// DCL CVDA FIXED BIN(31) INITIAL(0);
//// DCL SESSAME CHAR(4) INITIAL('SES');
//// DCL PARTAME CHAR(8) INITIAL('PAR');
//// DCL SYSID CHAR(4) INITIAL('SYS');
//// EXEC CICS ALLOCATE SYSID(SYSID);
//// EXEC CICS ALLOCATE SYSID(SYSID) PROFILE(NAME);
//// EXEC CICS ALLOCATE PARTNER(PARTAME);
//// EXEC CICS ALLOCATE PARTNER(PARTAME) NOQUEUE;
//// EXEC CICS ALLOCATE PARTNER(PARTAME) STATE(CVDA);
//// EXEC CICS ALLOCATE SESSION(SESSAME);

verify.noDiagnosticsFrom(languages.Cics);
