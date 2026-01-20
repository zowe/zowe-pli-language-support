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

//// DCL 1 OUT_RECORD,
////       2 EMPLOYEE,
////         3 SURNAME CHAR(14),
////         3 NAME CHAR(11),
////       2 <|1><|SECTOR|> CHAR(8);

types.expectTypeAt("SECTOR", {
  type: types.dataTypes.String,
  stringBits: {
    kind: types.stringKinds.Character,
    length: 8,
  }
});
hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 OUT_RECORD,
      2 SECTOR CHARACTER(8);`),
);


