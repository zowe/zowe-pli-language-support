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

//// DEFINE STRUCT 1 <|A|>, 2 B FIXED;
//// TEST: PROC;
////   VAR = BIND(:<|A>A, ALLOC(SIZE(:<|A>A:)):);
//// END TEST;

linker.expectLinks();
// Colons should not generate parser errors
verify.noParserDiagnostics();
