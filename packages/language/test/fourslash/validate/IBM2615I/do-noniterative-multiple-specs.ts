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
 * DO with multiple specifications (X = 1, 3) – should NOT trigger IBM2615I
 */
// @wrap: main
//// <|1:DO|> X = 1, 3;
////   CALL SOMETHING;
//// END;

verify.noDiagnostics(1);
