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

// @filename: cpy/lib.pli
//// LIB_VAR

// @filename: main.pli
//// %IF 1 %THEN <|INCLUDE|> lib;
//// %IF 1 %THEN <|%|>INCLUDE lib;

// This asserts that the statement after IF-THEN does not require a percent sign
// BUT can have one if desired
preprocessor.expectTokens(`
  LIB_VAR
  LIB_VAR
`);
verify.noDiagnostics(["%", "INCLUDE"]);
