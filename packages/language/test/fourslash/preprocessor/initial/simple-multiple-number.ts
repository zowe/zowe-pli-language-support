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

// @compiler: true
//// %DECLARE A FIXED INIT(1, 2, 3, 4, 5);
//// A

// It should only pick the first one
// TODO: Consider showing a warning for multiple initial values
preprocessor.expectTokens("1");
