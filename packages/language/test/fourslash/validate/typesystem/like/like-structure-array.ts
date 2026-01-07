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

////  dcl 1 aa(30)
////     ,5 aa1               fixed bin(31)
////     ,5 aa2_array(30)
////       ,7 aa2_1           fixed dec(15,2)
////  ;
////  dcl <|bb|>              like aa;
////  dcl <|cc|>              like aa2_array;

verify.noDiagnostics(undefined, ...code.TypeSystem);
types.expectTypeAt("bb", {
  type: types.dataTypes.Structure,
  dimension: [
    {
      lowerBound: { value: 1 },
      upperBound: { value: 30 },
    },
  ],
  members: {
    AA1: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Binary,
      precision: { totalDigitsCount: 31 },
    },
    AA2_ARRAY: {
      type: types.dataTypes.Structure,
      dimension: [
        {
          lowerBound: { value: 1 },
          upperBound: { value: 30 },
        },
      ],
      members: {
        AA2_1: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          base: types.bases.Decimal,
          precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
        },
      },
    },
  },
});
types.expectTypeAt("cc", {
  type: types.dataTypes.Structure,
  dimension: [
    {
      lowerBound: { value: 1 },
      upperBound: { value: 30 },
    },
  ],
  members: {
    AA2_1: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Decimal,
      precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
    },
  },
});
