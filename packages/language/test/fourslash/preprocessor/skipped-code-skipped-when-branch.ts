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
//// %DECLARE C fixed;
//// %C = 42;
//// %SELECT (C);
//// %WHEN (2) <|skipped:PUT(2);|>
//// %WHEN (42) PUT(42);
//// %WHEN (16) <|skipped:PUT(16);|>
//// %OTHERWISE <|skipped:PUT(1);|>
//// %END;

preprocessor.expectSkippedCodeAt("skipped");
