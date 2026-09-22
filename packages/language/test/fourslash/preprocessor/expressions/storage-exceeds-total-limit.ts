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

/**
 * The per-value cap does not bound aggregate memory: a loop can store a distinct capped
 * string into a different array element on every iteration. The total storage a run may
 * retain is capped as well; stores past the cap are dropped and reported.
 */
//// %DCL A(1000) CHAR;
//// %DCL I FIXED;
//// %DO I = 1 TO 200;
////   %<|A|>(I) = COPY('X', 99999);
//// %END;

verify.expectDiagnosticsAt("A", code.LspCodes.StorageTooLarge);
