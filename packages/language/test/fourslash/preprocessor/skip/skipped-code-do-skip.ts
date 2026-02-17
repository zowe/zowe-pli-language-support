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
 * Test that code inside %DO SKIP is marked as skipped
 */

// @wrap: main
//// %DO SKIP;<|skipped:
////   DCL G FIXED BINARY(31);
////   DCL H FIXED BINARY(31);
////   DCL J FIXED BINARY(31);
////   DCL K FIXED BINARY(31);
////   DCL WHAT FIXED BINARY(31);
//// |>%END;

preprocessor.expectSkippedCodeAt("skipped");
