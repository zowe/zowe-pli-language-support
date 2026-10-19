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

/// <reference path="../framework.ts" />

// @filename: file:///yyy.pli
//// XXX: PROCEDURE (X) RETURNS(FIXED);
////   DCL <|X|>(10) <|1:ANY|>;
////   RETURN(34);
//// END;

verify.expectDiagnosticsAt("1", code.LSP.BuiltinAttributes.IsForbiddenUsage);
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
