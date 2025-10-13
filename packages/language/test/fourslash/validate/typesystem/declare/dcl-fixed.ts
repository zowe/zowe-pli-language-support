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
//// DCL <|1:ANYTHING|> FIXED;

types.expectTypeAt('1', {
  type: types.dataTypes.Arithmetic,  
  scale: types.scales.Fixed(5, 0),
  mode: types.modes.Real,
});
verify.noDiagnostics(undefined, ...code.TypeSystem);
