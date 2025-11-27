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
 * Test for valid %SKIP directive
 */

// @wrap: main
//// %DO <|1:SKIP|>;
////   DCL G FIXED BINARY(31);
////   DCL H FIXED BINARY(31);
////   DCL J FIXED BINARY(31);
////   DCL K FIXED BINARY(31);
////   DCL WHAT FIXED BINARY(31);
//// %END;

verify.noDiagnostics(1);
