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

//// DEFINE STRUCTURE 1 PERSON,
////                    2 NAME CHAR(20),
////                    2 AGE FIXED DECIMAL(3);
//// DCL <|1>HEX ENTRY RETURNS(TYPE PERSON) EXTERNAL;

hover.expectMarkdownAt(
  1,
  hover.codeBlock("DCL HEX ENTRY RETURNS() EXTERNAL;"),
);
