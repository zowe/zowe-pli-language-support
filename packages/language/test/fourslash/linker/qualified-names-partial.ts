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
 Must infer partially qualified names
 */
// @wrap: main
//// DCL 1 A,
////        2 <|b1:B|>,
////          3 K, // Should be skipped in qualification
////            4 <|c:C|> CHAR(8) VALUE("C");
//// DCL 1 A2,
////        2 <|b2:B|>,
////          3 K, // Should be skipped in qualification
////            4 <|d:D|> CHAR(8) VALUE("D");
//// PUT (<|b1>B.<|c>C);
//// PUT (<|b2>B.<|d>D);

linker.expectLinks();
