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
//// DCL <|1:ANYTHING|> FIXED DIM(10) INITIAL ((10)0);

types.expectTypeAt("1", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  precision: types.precision.create(5, 0),
  dimension: [{ lowerBound: 1, upperBound: 10 }],
  mode: types.modes.Real,
});
verify.noDiagnostics(undefined, ...code.TypeSystem);
