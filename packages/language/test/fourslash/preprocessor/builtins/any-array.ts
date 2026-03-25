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

/// <reference path="../../framework.ts" />

// @filename: pli-builtin:///xxx.pli
//// XXX: PROCEDURE (X) RETURNS(FIXED);
////   DCL <|X|>(10) <|1:ANY|>;
////   RETURN(12);
//// END;

// @filename: file:///yyy.pli
//// YYY: PROCEDURE (Y) RETURNS(FIXED);
////   DCL <|Y|>(10) <|2:ANY|>;
////   RETURN(34);
//// END;

verify.noDiagnostics("1");
types.expectTypeAt("X", {
  type: types.dataTypes.Unknown,
  dimension: [
    {
      lowerBound: {
        value: 1,
      },
      upperBound: {
        value: 10,
      },
    },
  ],
});

verify.expectDiagnosticsAt("2", code.Internal.BuiltinAttributeUsage);
types.expectTypeAt("Y", {
  type: types.dataTypes.Unknown,
  dimension: [
    {
      lowerBound: {
        value: 1,
      },
      upperBound: {
        value: 10,
      },
    },
  ],
});
