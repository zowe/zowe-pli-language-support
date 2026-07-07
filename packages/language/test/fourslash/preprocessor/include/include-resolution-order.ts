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

// Tests that file & member includes resolve in a BFS search order
// I.e. shallowest matching file/member is included first
// And for matching depth, alphabetical order breaks the tie

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "cpy/**",
////                 "cpy2"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: cpy/l1.pli
//// DECLARE L1 FIXED;

// @filename: cpy/TF(m1)
//// DECLARE M1 FIXED;

// @filename: cpy2/l3.pli
//// DECLARE L3 FIXED;

// @filename: cpy/a/l1.pli
//// DECLARE L1_IN_A FIXED;

// @filename: cpy/a/TF(m1)
//// DECLARE M1_IN_A FIXED;

// deeply nested file: matched by "cpy/**" but should not be selected (loses on depth)
// @filename: cpy/a/b/l2.pli
//// DECLARE L2_IN_A_B FIXED;

// @filename: cpy/d/l2.pli
//// DECLARE L2_IN_D FIXED;

// shallower nested file that should match instead of the one above
// also alphabetically before /cpy/d/l2.pli
// @filename: cpy/c/l2.pli
//// DECLARE L2_IN_C FIXED;

// @filename: cpy/a/l3.pli
//// DECLARE L3_IN_A FIXED;

// @filename: main.pli
//// %INCLUDE "l1.pli";
//// %INCLUDE "l2.pli";
//// %INCLUDE m1;
//// %INCLUDE l3;

preprocessor.expectTokens(`
  DECLARE L1 FIXED;
  DECLARE L2_IN_C FIXED;
  DECLARE M1 FIXED;
  DECLARE L3 FIXED;
`);
