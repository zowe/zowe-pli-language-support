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
////           02 person,
////             03 name CHAR(10),
////             03 age FIXED,
////           02 signature,
////             03 key CHAR(100),
////             03 parity BIT(1);
types.expectTypeAt(1, {
  type: types.dataTypes.Structure,
  members: {
    PERSON: {
      type: types.dataTypes.Structure,
      members: {
        NAME: {
          type: types.dataTypes.String,
          kind: types.stringKinds.Character,
          length: 10,
        },
        AGE: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
        },
      },
    },
    SIGNATURE: {
      type: types.dataTypes.Structure,
      members: {
        KEY: {
          type: types.dataTypes.String,
          kind: types.stringKinds.Character,
          length: 100,
        },
        PARITY: {
          type: types.dataTypes.String,
          kind: types.stringKinds.Bit,
          length: 1,
        },
      },
    },
  },
});
