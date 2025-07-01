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
 * DO TYPE 3 links to proper var
 */

// @wrap: main
//// DCL <|1:I|> FIXED;
//// DO <|1>I = 0 TO 10;
////   PUT(<|1>I);
//// END;

linker.expectLinks();
