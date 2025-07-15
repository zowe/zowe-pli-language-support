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
//// <|1>C = 1;
//// PUT(<|1>C);
//// DCL <|1:C|> FIXED(15) INIT(0);

verify.noDiagnostics();
linker.expectLinks();
