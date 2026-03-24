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

// In theory, `EXEC SQL INCLUDE SQLCA;` should always be valid, using the builtin as a fallback.
// However, `%INCLUDE SQLCA;` shouldn't do anything if the file doesn't exist.

// @filename: main.pli
//// %INCLUDE <|SQLCA|>;

verify.expectExclusiveDiagnosticsAt("SQLCA", [code.Severe.IBM1848I]);
preprocessor.expectTokens("");
