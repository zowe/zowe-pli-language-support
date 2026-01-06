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
//// define alias num fixed bin;
//// dcl <|n|> type num;

types.expectTypeAt("n", {
    type: types.dataTypes.Arithmetic,
    base: types.bases.Binary,
    scale: types.scales.Fixed,
});
