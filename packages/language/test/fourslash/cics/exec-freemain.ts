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
//// DCL AREA FIXED INITIAL(0);
//// DCL PTR POINTER;
//// EXEC CICS FREEMAIN DATA(AREA);
//// EXEC CICS FREEMAIN DATAPOINTER(PTR);

verify.noDiagnosticsFrom(languages.Cics);
