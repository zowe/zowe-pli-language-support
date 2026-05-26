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

// @wrap: main
//// %DECLARE I fixed;
//// %DO I = 1 TO 2;
////   %IF I = 1 %THEN <|notSkipped1:%DO;
////     WHAT = 123;
////   %END;|>
////   %ELSE <|notSkipped2:%DO;
////     WHAT = 456;
////   %END;|>
//// %END;

preprocessor.not.expectSkippedCodeAt("notSkipped1");
preprocessor.not.expectSkippedCodeAt("notSkipped2");
