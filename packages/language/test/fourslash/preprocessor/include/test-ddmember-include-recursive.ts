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

// Tests including a ddname(member) by its member

/// <reference path="../../framework.ts" />

// TODO @montymxb Oct 17th, 2025: Replace with a fourslash utility to trigger config reload
// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////         "name": "default",
////         "lsp-options": {
////             "check-margins": true
////         },
////         "libs": [
////             "cpy"
////         ]
////         }
////     ]
//// }

// @filename: cpy/MYLIB(m1)
//// DECLARE LIB_VAR1 FIXED;

// @filename: cpy/A.B.C(m2)
//// DECLARE LIB_VAR2 FIXED;

// @filename: main.pli
//// %INCLUDE m1;
//// %INCLUDE m2;

preprocessor.expectTokens(`
  DECLARE LIB_VAR1 FIXED;
  DECLARE LIB_VAR2 FIXED;
`);
