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
//// %WHEN (2) <|skipped:DO; PUT(2); %END;|>
//// %WHEN (42) DO; PUT(42); %END;
//// %WHEN (16) <|skipped:DO; PUT(16); %END;|>
//// %OTHERWISE <|skipped:DO; PUT(1); %END;|>
//// %END;

preprocessor.expectSkippedCodeAt("skipped");
