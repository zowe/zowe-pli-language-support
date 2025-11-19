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
//// DCL <|1:ANYTHING|> FIXED DIM(*, *, *) INITIAL (1, 2, 3, 4, 5, 6, 7, 8);

types.expectTypeAt("1", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  precision: types.precision.create(5, 0),
  dimension: [
    {
      lowerBound: {
        value: 1,
      },
      upperBound: {
        value: "*",
      },
    },
    {
      lowerBound: {
        value: 1,
      },
      upperBound: {
        value: "*",
      },
    },
    {
      lowerBound: {
        value: 1,
      },
      upperBound: {
        value: "*",
      },
    },
  ],
  mode: types.modes.Real,
});
verify.noDiagnostics(undefined, ...code.TypeSystem);
