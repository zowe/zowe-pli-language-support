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

//// DEFINE ORDINAL <|1:T|>(A, B);
//// TEST: PROC;
////   VAR = <|FIRST|>(<|:|><|1>T<|:|>);
//// END PLEA;

linker.expectLinks();
// Colons should not generate parser errors
// Also, "FIRST" should link to the built-in type function
verify.noDiagnostics([":", "FIRST"]);
