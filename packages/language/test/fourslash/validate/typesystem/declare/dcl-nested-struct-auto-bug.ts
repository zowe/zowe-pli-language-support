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

//Bug: The AUTO attribute was causing issues: Could not decide that HEADER_OVLY is a structure.

// @wrap: main
//// DECLARE  1  LOC_HEADER AUTO,
////             2  STMT   CHAR(8)       INIT(' '),
////             2  HEADER CHAR(4)       INIT(' ');
//// DECLARE <|HEADER_OVLY|> LIKE LOC_HEADER;

verify.noDiagnostics();
types.expectTypeAt("HEADER_OVLY", {
  type: types.dataTypes.Structure,
  members: {
    STMT: {
      type: types.dataTypes.String,
      stringBits: {
        kind: types.stringKinds.Character,
        length: 8,
      },
    },
    HEADER: {
      type: types.dataTypes.String,
      stringBits: {
        kind: types.stringKinds.Character,
        length: 4,
      },
    },
  },
});
