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

//// %DCL VAR FIXED;
//// %VAR = 0;
//// %outer: DO %FOREVER;
////   %VAR = VAR + 1;
////   %inner: DO %FOREVER;
////     %VAR = VAR + 2;
////     %LEAVE inner;
////   %END;
////   %LEAVE;
//// %END;
//// X = VAR;

preprocessor.expectTokens(" X = 3;");
