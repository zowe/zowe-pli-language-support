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

/**
 Redeclaration within nested sublevels must fail
 */
// @wrap: main
//// DCL 1 A,
////       2 B,
////         3 C CHAR(8) VALUE("C"),
////       2 <|1:B|>,
////         3 D CHAR(8) VALUE("D");

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1308I.fullCode);
