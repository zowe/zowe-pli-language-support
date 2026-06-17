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
//// EXEC CICS HANDLE ABEND;
//// EXEC CICS HANDLE ABEND CANCEL;
//// EXEC CICS HANDLE ABEND PROGRAM('AAAAAAAA');
//// //LABEL not supported in PL/I:
//// //EXEC CICS HANDLE ABEND LABEL(L);
//// EXEC CICS HANDLE ABEND RESET;

verify.noDiagnosticsFrom(languages.Cics);
