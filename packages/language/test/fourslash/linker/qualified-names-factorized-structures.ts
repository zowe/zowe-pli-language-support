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
 Factorized names in structures are correctly unrolled
 */
// @wrap: main
//// DCL 1 A, 2 (B, C, <|1:D|>), 3 <|2:E|>;
//// PUT(A.<|1>D.<|2>E);
//// PUT(<|1>D.<|2>E);

linker.expectLinks();
