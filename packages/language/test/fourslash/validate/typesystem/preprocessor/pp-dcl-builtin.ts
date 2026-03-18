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
//// %DCL <|ANYTHING|> <|BUILTIN|>;

verify.noDiagnostics("BUILTIN", code.Error.IBM3552I);
types.expectTypeAt("ANYTHING", {
  type: types.dataTypes.Unknown,
  builtIn: true,
});
