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

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: cpy/lib.pli
//// 1

// @case-sensitive: true
// @filename: main.pli
//// %INCLUDE LIB;

preprocessor.expectTokens("1");
