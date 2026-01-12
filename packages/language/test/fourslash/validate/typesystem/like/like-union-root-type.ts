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
//// declare 1 address union,
////           2 mailbox fixed(5),
////           2 street char(100);
//// declare <|same|> like address;

verify.noDiagnostics();
types.expectTypeAt("same", {
  type: types.dataTypes.Union,
  members: {
    MAILBOX: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      precision: { totalDigitsCount: 5 },
    },
    STREET: {
      type: types.dataTypes.String,
      stringBits: {
        kind: types.stringKinds.Character,
        length: 100,
      }
    },
  },
});
