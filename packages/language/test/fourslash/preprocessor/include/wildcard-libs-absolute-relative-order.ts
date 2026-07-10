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

// Include-resolution priority is shallowest-first, with depth measured relative
// to each lib's OWN base, then config order breaks same-depth ties. Here an
// absolute lib and a relative lib both sit at their own base (depth 0) and both
// contain COMMON.pli; the absolute lib is listed first, so it wins.
//
// This guards against the old behavior, which counted raw "/" separators as
// depth and therefore made the absolute path (more slashes) always lose to the
// relative one regardless of config order.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "/opt/copybooks",
////                 "shared"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// absolute lib, listed first -> wins the same-depth tie
// @filename: /opt/copybooks/COMMON.pli
//// DECLARE FROM_ABS FIXED;

// relative lib, listed second -> loses the tie despite its shorter path
// @filename: shared/COMMON.pli
//// DECLARE FROM_REL FIXED;

// @filename: main.pli
//// %INCLUDE "COMMON.pli";

preprocessor.expectTokens(`
  DECLARE FROM_ABS FIXED;
`);
