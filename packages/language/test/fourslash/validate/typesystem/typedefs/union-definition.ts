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

/// <reference path="../../../framework.ts" />

// @wrap: main
//// DEFINE STRUCTURE 1 A UNION, 2 B FIXED(31), 2 C CHAR(10);
//// DCL <|MY_UNION|> TYPE A;

types.expectTypeAt("MY_UNION", {
  type: types.dataTypes.Union,
  members: {
    B: {
      type: types.dataTypes.Arithmetic,
      precision: {
        totalDigitsCount: 31,
      },
    },
    C: {
      type: types.dataTypes.String,
      stringBits: {
        kind: types.stringKinds.Character,
        length: 10,
      } 
    },
  },
});
