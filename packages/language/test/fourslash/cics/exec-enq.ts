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
//// DCL RES CHAR(8) INITIAL('RES');
//// DCL LEN FIXED BIN(15) INITIAL(0);
//// DCL LEN2 FIXED BIN(31) INITIAL(0);
//// EXEC CICS ENQ RESOURCE(RES);
//// EXEC CICS ENQ RESOURCE(RES) LENGTH(LEN);
//// EXEC CICS ENQ RESOURCE(RES) UOW;
//// EXEC CICS ENQ RESOURCE(RES) MAXLIFETIME(LEN2);
//// EXEC CICS ENQ RESOURCE(RES) TASK;

verify.noDiagnosticsFrom(languages.Cics);
