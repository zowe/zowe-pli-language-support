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
 Must work before declaration
 */
// @wrap: main
//// PUT(<|a>A);
//// <|a>A = "A2";
//// DCL <|a:A|> CHAR(8) INIT("A");
//// PUT(<|a>A);

linker.expectLinks();
