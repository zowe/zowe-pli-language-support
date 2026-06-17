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

////*PROCESS LP(64);
////
//// STARTPR: PROCEDURE OPTIONS (MAIN);
////   DCL <|x64|> type __SIGNED_INT;
////   DCL <|y64|> type __UNSIGNED_INT;
//// END STARTPR;

types.expectTypeAt("x64", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  base: types.bases.Binary,
  sign: types.signs.Signed,
  precision: { totalDigitsCount: 63 },
});

types.expectTypeAt("y64", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  base: types.bases.Binary,
  sign: types.signs.Unsigned,
  precision: { totalDigitsCount: 64 },
});
