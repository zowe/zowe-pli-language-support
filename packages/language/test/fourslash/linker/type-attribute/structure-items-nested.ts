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

// @wrap: main
//// DEFINE STRUCTURE 1 A, 2 <|b:B|>, 3 <|c:C|> FIXED(31);
//// DCL MY_STRUCT TYPE A;
//// MY_STRUCT.<|b>B.<|c>C = 10;
//// MY_STRUCT.<|c>C = 20;

linker.expectLinks();
