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
////     ,5 aa1               char( 5)
////     ,5 aa2               fixed bin(31)
////     ,5 aa3_array(30)
////       ,7 aa3_1           fixed dec(15,2)
////       ,7 aa3_2           fixed dec(15,2)
////       ,7 aa3_3           fixed dec(11,4)
////       ,7 aa3_4           fixed dec(7,3)
////  ;
////  dcl <|bb|>              like aa;
////  dcl <|cc|>              like aa3_array;

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
    AA1: { type: types.dataTypes.String, length: 5 },
    AA2: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Binary,
      precision: { totalDigitsCount: 31 },
    },
    AA3_ARRAY: {
      type: types.dataTypes.Structure,
      dimension: [
        {
          lowerBound: { value: 1 },
          upperBound: { value: 30 },
        },
      ],
      members: {
        AA3_1: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          base: types.bases.Decimal,
          precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
        },
        AA3_2: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          base: types.bases.Decimal,
          precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
        },
        AA3_3: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          base: types.bases.Decimal,
          precision: { totalDigitsCount: 11, fractionalDigitsCount: 4 },
        },
        AA3_4: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          base: types.bases.Decimal,
          precision: { totalDigitsCount: 7, fractionalDigitsCount: 3 },
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
    AA3_1: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Decimal,
      precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
    },
    AA3_2: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Decimal,
      precision: { totalDigitsCount: 15, fractionalDigitsCount: 2 },
    },
    AA3_3: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Decimal,
      precision: { totalDigitsCount: 11, fractionalDigitsCount: 4 },
    },
    AA3_4: {
      type: types.dataTypes.Arithmetic,
      scale: types.scales.Fixed,
      base: types.bases.Decimal,
      precision: { totalDigitsCount: 7, fractionalDigitsCount: 3 },
    },
  },
});
