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
//// DCL 1 A, 2 (B, C, D), 3 <|def3:E|>;
//// PUT(A.B.<|1>E);
//// PUT(A.C.<|2>E);
//// PUT(A.D.<|def3>E);

linker.expectLinks();
linker.expectNoLinksAt("1");
linker.expectNoLinksAt("2");
