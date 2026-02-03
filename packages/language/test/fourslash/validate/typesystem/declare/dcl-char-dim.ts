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
//// DCL <|1:ANYTHING|> CHARACTER(10);

verify.noDiagnostics(undefined, ...code.TypeSystem);
types.expectTypeAt(1, {
  type: types.dataTypes.String,
  stringBits: {
    kind: types.stringKinds.Character,
    length: 10,
  },
});
