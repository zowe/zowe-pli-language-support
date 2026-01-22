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
//// declare 01 <|1:struct|>,
////           02 <|2:name|> CHAR(10),
////           02 <|3:age|> FIXED;
types.expectTypeAt(1, {
  type: types.dataTypes.Structure,
  members: {
    NAME: {
      type: types.dataTypes.String,
      stringBits: {
        kind: types.stringKinds.Character,
        length: 10,
      },
    },
    AGE: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
    },
  },
});
types.expectTypeAt(2, {
  type: types.dataTypes.String,
  stringBits: {
    kind: types.stringKinds.Character,
    length: 10,
  },
});
types.expectTypeAt(3, {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
});
