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

// Perform an include on a member w/ validation enabled in the plugin config

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
////             ],
////             "member-name-validation": true
////         }
////     ]
//// }

// @filename: cpy/ddname(m12345678)
//// // expecting to be invalid
//// DECLARE V1 FIXED;

// @filename: cpy/ddname(m1234567)
//// // expecting to be valid
//// DECLARE V2 FIXED;

// @filename: cpy/ddname(A1@#_$)
//// DECLARE V3 FIXED;

// @filename: cpy/__legitimatefile.pli
//// DECLARE V4 FIXED;

// @filename: main.pli
//// %INCLUDE <|1:m12345678|>;
//// %INCLUDE <|2:m1234567|>;
//// %INCLUDE <|3:A1@#_$|>;
//// // bad include
//// %INCLUDE <|4:_A1@#|>;
//// // legitimate file include
//// %INCLUDE <|5:__legitimatefile|>;

// verify 1 diagnostic on the first include only
verify.expectExclusiveDiagnosticsAt(1, [
  code.LSP.MemberValidation.ExceedsMaxLength,
]);
// no diagnostics on the second include
verify.expectExclusiveDiagnosticsAt(2, []);
// no diagnostics on the 3rd include
verify.expectExclusiveDiagnosticsAt(3, []);

// verify 2 diagnostics on the 4th include
// one for invalid starting char, and another for unresolved include
verify.expectExclusiveDiagnosticsAt(4, [
  code.LSP.MemberValidation.InvalidName,
  code.Severe.IBM3841I,
]);

// lastly verify no diagnostics on the legitimate file include
verify.expectExclusiveDiagnosticsAt(5, []);

// still expecting the same tokens as before
preprocessor.expectTokens(`
  DECLARE V1 FIXED;
  DECLARE V2 FIXED;
  DECLARE V3 FIXED;
  DECLARE V4 FIXED;
`);
