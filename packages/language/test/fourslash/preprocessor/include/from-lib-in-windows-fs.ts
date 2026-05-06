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

// @filename: C:\workspace\.pliplugin\pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "C:\\workspace\\*.pli",
////       "pgroup": "default"
////     }
////   ]
//// }

// @filename: C:\workspace\.pliplugin\proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "C:\\workspace\\cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: C:\workspace\cpy\lib.pli
//// 1

// @filename: C:\workspace\main.pli
//// %INCLUDE LIB;

preprocessor.expectTokens("1");
