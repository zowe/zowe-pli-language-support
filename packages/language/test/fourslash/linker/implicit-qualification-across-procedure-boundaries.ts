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
 Must work across procedure boundaries
 */
// @wrap: main
//// PUT(<|a>A);
////
//// LABL: PROCEDURE;
////   PUT(<|a>A);
//// END LABL;
////
//// PUT(<|a>A);
//// CALL LABL;
////
//// DCL <|a:A|> CHAR(8) INIT("A");

linker.expectLinks();
