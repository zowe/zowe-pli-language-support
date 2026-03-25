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
////   DCL <|X|>(*) FIXED <|VARARG|>;
////   RETURN(12);
//// END;

verify.noDiagnostics("VARARG");
types.expectTypeAt("X", {
  type: types.dataTypes.Arithmetic,
  scale: types.scales.Fixed,
  dimension: [
    {
      lowerBound: {},
      upperBound: {
        value: "*",
      },
    },
  ],
});
