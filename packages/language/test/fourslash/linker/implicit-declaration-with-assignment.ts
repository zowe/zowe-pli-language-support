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
//// DCL 1 A, 2 C BIN FIXED(15) INIT(0);
//// A.C, <|1:B|> = 1;
//// PUT(<|1>B);

verify.expectExclusiveErrorCodesAt(1, code.Error.IBM1373I.fullCode);
linker.expectLinks();
