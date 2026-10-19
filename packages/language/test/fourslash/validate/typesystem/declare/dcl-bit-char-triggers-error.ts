/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../../framework.ts" />

// @wrap: main
//// DCL <|1:ANYTHING|> CHAR(10) <|2:BIT|>(10);

verify.expectDiagnosticsAt(2, code.Error.IBM2462I);
types.expectTypeAt(1, {
  type: types.dataTypes.String,
  stringBits: {
    kind: types.stringKinds.Character,
    length: 10,
  },
});
