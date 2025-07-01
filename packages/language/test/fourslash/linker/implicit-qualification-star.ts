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
 Star name in structure should result in partial qualification
 */
// @wrap: main
//// DCL 1 A,
////       2 *,
////         3 <|b:B|> CHAR(8) VALUE("B");
//// PUT(A.<|b>B);

linker.expectLinks();
