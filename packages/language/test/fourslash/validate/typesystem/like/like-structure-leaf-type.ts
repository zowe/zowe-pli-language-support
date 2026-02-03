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
////           2 name char(100),
////           2 age fixed(3);
//// declare <|same|> like person.age;
//// declare <|same2|> like age;

verify.expectDiagnosticsAt("same", code.Severe.IBM1650I);
verify.expectDiagnosticsAt("same2", code.Severe.IBM1650I);
types.expectTypeAt("same", {
  type: types.dataTypes.Unknown,
});
types.expectTypeAt("same2", {
  type: types.dataTypes.Unknown,
});
