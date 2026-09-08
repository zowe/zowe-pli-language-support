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

// A qualified host variable whose parts share a name: each part must link to its own
// level, not both to the first `X` the linker finds.
// @wrap: main
//// DCL 1 <|1:X|>, 2 <|2:X|> FIXED;
//// EXEC SQL SELECT 1 INTO :<|1>X.<|2>X FROM T;

verify.noParserDiagnostics();
linker.expectLinks();
