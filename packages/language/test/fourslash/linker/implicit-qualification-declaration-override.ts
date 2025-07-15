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
 Declaration must override implicit qualification
 */
// @wrap: main
//// DCL 1 <|1:A|>,
////     2 <|2:B|> CHAR(8) VALUE("B");
//// DCL <|3:B|> CHAR(8) VALUE("B2");
//// PUT(<|3>B);
//// PUT(<|1>A.<|2>B);

linker.expectLinks();
