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

/// <reference path="../../framework.ts" />

//// DCL 1 PERSON,
////       2 NAME CHAR(20),
////       2 AGE FIXED DEC(3),
////     <|1><|INDEPENDENT|> FIXED BIN(15),
////     1 <|2>ADDRESS,
////       2 STREET CHAR(30),
////       2 CITY CHAR(20),
////     <|3>INDEPENDENT2 FLOAT DEC
//// ;

types.expectTypeAt("INDEPENDENT", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  base: types.bases.Binary,
  precision: {
    totalDigitsCount: 15,
  },
});
hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL INDEPENDENT FIXED BINARY PRECISION(15);`),
);
hover.expectMarkdownAt(
  2,
  hover.codeBlock(`DCL 1 ADDRESS,
      2 STREET CHARACTER(30),
      2 CITY CHARACTER(20);`),
);
hover.expectMarkdownAt(3, hover.codeBlock(`DCL INDEPENDENT2 FLOAT DECIMAL;`));
