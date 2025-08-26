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
 * LEAVE inside DO WHILE (doType2) – should NOT trigger IBM1219I
 */
// @wrap: main
//// DCL X FIXED BIN(31);
//// DO WHILE (X > 0);
////   <|1:LEAVE|>;
////   X = X - 1;
//// END;

verify.noDiagnostics(1);
