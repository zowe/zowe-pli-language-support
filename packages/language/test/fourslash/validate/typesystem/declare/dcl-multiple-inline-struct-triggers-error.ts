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
//// declare 01 (<|a:a|>,<|b:b|>,<|c:c|>),
////            02 x FIXED,
////            02 y CHAR(10);
types.expectTypeAt('a', {
    type: types.dataTypes.Unknown,
});
types.expectTypeAt('b', {
    type: types.dataTypes.Unknown,
});
types.expectTypeAt('c', {
  type: types.dataTypes.Structure,
  members: {
    X: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed(),
    },
    Y: {
      type: types.dataTypes.String,
      kind: types.stringKinds.Character,
      length: 10,
    },
  },
});

