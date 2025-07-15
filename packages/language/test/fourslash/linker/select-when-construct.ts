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
 * Must find declaration in SELECT/WHEN construct
 */

// @wrap: main
//// SELECT (123);
////    WHEN (123)
////    DO;
////        DCL <|1:BFSTRING|> CHAR(255);
////        PUT SKIP LIST(<|1>BFSTRING);
////    END;
//// END;

linker.expectLinks();
