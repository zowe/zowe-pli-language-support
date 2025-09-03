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
 * SELECT without OTHERWISE should inform.
 */

// @wrap: main
//// DCL X FIXED BIN(15) INIT(1);
//// <|1:SELECT|>;
////   WHEN (X = 1) PUT SKIP LIST('Matched');
//// END;

verify.expectExclusiveErrorCodesAt(1, code.Information.IBM1059I.fullCode);
