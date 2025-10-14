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
//// DCL <|1:ANYTHING|> FLOAT <|2:PRECISION|>(10, 5);

verify.expectDiagnosticsAt(2, {
  //code: code.Error.IBM2462I.fullCode,
  code: code.Error.IBM2424I.fullCode,
});
types.expectTypeAt(1, {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Float,
});
