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

// Including a ddname(member) even though the ddname part is already in the libs

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////         "name": "default",
////         "lsp-options": {
////             "check-margins": true
////         },
////         "libs": [
////             "cpy2/MYLIB"
////         ]
////         }
////     ]
//// }

// @filename: cpy2/MYLIB(m)
//// SUCCESS

// @filename: main.pli
//// %INCLUDE MYLIB(m);

preprocessor.expectTokens("SUCCESS");
