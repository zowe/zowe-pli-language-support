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

// @filename: cpy/include.pli
//// %DCL <|X|> FIXED;    //TODO cannot access
//// %X = 100;

// @filename: main.pli
//// %INCLUDE "include.pli";
//// PUT SKIP EDIT (%X);

preprocessor.expectTokens("PUT SKIP EDIT (100);");
types.expectTypeAt("X", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  precision: types.precision.create(5, 0),
  mode: types.modes.Real,
});
