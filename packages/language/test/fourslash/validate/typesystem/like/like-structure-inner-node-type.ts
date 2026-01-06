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
//// declare 1 person,
////           2 address,
////.            3 street char(100),
////.            3 city char(50);
//// declare <|same|> like person.address;
//// declare <|same2|> like address;

verify.noDiagnostics();
types.expectTypeAt("same", {
    type: types.dataTypes.Structure,
    members: {
        STREET: {
            type: types.dataTypes.String,
            length: 100
        },
        CITY: {
            type: types.dataTypes.String,
            length: 50
        }
    }
});
types.expectTypeAt("same2", {
    type: types.dataTypes.Structure,
    members: {
        STREET: {
            type: types.dataTypes.String,
            length: 100
        },
        CITY: {
            type: types.dataTypes.String,
            length: 50
        }
    }
});
