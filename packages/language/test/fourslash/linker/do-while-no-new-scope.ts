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
 * DO WHILE does not create a new scope
 */
// @wrap: main
//// PUT(<|a>A);
//// DO WHILE (<|a>A < 5);
////  PUT(<|a>A);
////  DCL <|a:A|> BIN FIXED(15) INIT(0);
////  <|proc:MYPROC|>: PROCEDURE;
////  END <|proc>MYPROC;
//// END;
//// PUT(<|a>A);
//// CALL <|proc>MYPROC;

linker.expectLinks();
