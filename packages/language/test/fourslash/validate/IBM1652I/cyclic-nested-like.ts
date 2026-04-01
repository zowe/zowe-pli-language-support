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
//// DCL A <|1:LIKE|> B;
//// DCL 1 B, 2 C <|2:LIKE|> A;

verify.expectErrorCodesAt(1, code.Severe.IBM1652I);
verify.expectErrorCodesAt(2, code.Severe.IBM1652I);
