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
 * Must handle use before declaration
 */

// @wrap: main
//// DCL <|1:A|> CHAR(8) INIT("A");
//// PUT(<|1>A); // -> "A"
////
//// LABL: PROCEDURE;
////   PUT(<|2>A); // -> "A2"
////   DCL <|2:A|> CHAR(8) INIT("A2");
////   PUT(<|2>A); // -> "A2"
//// END LABL;
////
//// PUT(<|1>A); // -> "A"
//// CALL LABL;
//// PUT(<|1>A); // -> "A"

linker.expectLinks();
