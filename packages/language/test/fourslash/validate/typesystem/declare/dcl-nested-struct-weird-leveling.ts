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
//// Declare 1 <|1:Payroll|>,
////             4 Name,
////               5 Last char(20),
////               5 First char(15),
////             3 Hours,
////               6 Regular fixed dec(5,2),
////               5 Overtime fixed dec(5,2),
////             2 Rate,
////               9 Regular fixed dec(3,2),
////               9 Overtime fixed dec(3,2);
types.expectTypeAt(1, {
  type: types.dataTypes.Structure,
  members: {
    NAME: {
      type: types.dataTypes.Structure,
      members: {
        LAST: {
          type: types.dataTypes.String,
          kind: types.stringKinds.Character,
          length: 20,
        },
        FIRST: {
          type: types.dataTypes.String,
          kind: types.stringKinds.Character,
          length: 15,
        },
      },
    },
    HOURS: {
      type: types.dataTypes.Structure,
      members: {
        REGULAR: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          precision: types.precision.create(5, 2),
          base: types.bases.Decimal,
        },
        OVERTIME: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          precision: types.precision.create(5, 2),
          base: types.bases.Decimal,
        },
      },
    },
    RATE: {
      type: types.dataTypes.Structure,
      members: {
        REGULAR: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          precision: types.precision.create(3, 2),
          base: types.bases.Decimal,
        },
        OVERTIME: {
          type: types.dataTypes.Arithmetic,
          scale: types.scales.Fixed,
          precision: types.precision.create(3, 2),
          base: types.bases.Decimal,
        },
      },
    },
  },
});
