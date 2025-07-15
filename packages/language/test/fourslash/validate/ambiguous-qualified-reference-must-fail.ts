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
 * Ambiguous reference must fail
 */

// @wrap: main
//// DCL 1 A1,
////       2 B,
////         3 C CHAR(8) VALUE("C1");
//// DCL 1 A2,
////       2 B CHAR(8),
////         3 C CHAR(8) VALUE("C2");
//// PUT(<|1:B.C|>);

verify.expectExclusiveErrorCodesAt("1", code.Severe.IBM1881I.fullCode);
