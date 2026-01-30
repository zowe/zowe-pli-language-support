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

// @filename: cpy/ABC.DEF(GHI)
//// // expecting to be valid
//// DECLARE V5 FIXED;

// @filename: cpy/ABC.DEF(GH@#_$I)
//// // expecting to be valid
//// DECLARE V6 FIXED;

// @filename: cpy/ABC.DEF(GHIJKLMNO)
//// // expecting to be invalid
//// DECLARE V7 FIXED;

// @filename: cpy/ABC.DEF(#GH@#_$I)
//// // expecting to be invalid
//// DECLARE V8 FIXED;

// @filename: cpy/ABC.DEF(_GH@#_$IJKLM)
//// // expecting to be invalid
//// DECLARE V9 FIXED;

// @filename: main.pli
//// %INCLUDE <|m12345678|>;
//// %INCLUDE <|m1234567|>;
//// %INCLUDE <|A1@#_$|>;
//// // bad include
//// %INCLUDE <|_A1@#|>;
//// // legitimate file include
//// %INCLUDE <|__legitimatefile|>;
//// %INCLUDE ABC.DEF(<|GHI|>);
//// %INCLUDE ABC.DEF(<|GH@#_$I|>);
//// %INCLUDE ABC.DEF(<|GHIJKLMNO|>);
//// %INCLUDE ABC.DEF(<|#GH@#_$I|>);
//// %INCLUDE ABC.DEF(<|_GH@#_$IJKLM|>);

// verify 1 diagnostic on the first include only
verify.expectExclusiveDiagnosticsAt("m12345678", [
  code.LSP.MemberValidation.ExceedsMaxLength,
]);
// no diagnostics on the second include
verify.expectExclusiveDiagnosticsAt("m1234567", []);
// no diagnostics on the 3rd include
verify.expectExclusiveDiagnosticsAt("A1@#_$", []);

// verify 2 diagnostics on the 4th include
// one for invalid starting char, and another for unresolved include
verify.expectExclusiveDiagnosticsAt("_A1@#", [
  code.LSP.MemberValidation.InvalidName,
  code.Severe.IBM1848I,
]);

// verify no diagnostics on the legitimate file include
verify.expectExclusiveDiagnosticsAt("__legitimatefile", []);

// verify no diagnostic on the member with valid ddnames.
verify.expectExclusiveDiagnosticsAt("GHI", []);
verify.expectExclusiveDiagnosticsAt("GH@#_$I", []);

// verify diagnostics for members with ddnames: exceeding lenght (8), invalid name (9), both (10)
verify.expectExclusiveDiagnosticsAt("GHIJKLMNO", [
  code.LSP.MemberValidation.ExceedsMaxLength,
]);
verify.expectExclusiveDiagnosticsAt("#GH@#_$I", [code.LSP.MemberValidation.InvalidName]);
verify.expectExclusiveDiagnosticsAt("_GH@#_$IJKLM", [
  code.LSP.MemberValidation.ExceedsMaxLength,
  code.LSP.MemberValidation.InvalidName,
]);

// still expecting the same tokens as before
preprocessor.expectTokens(`
  DECLARE V1 FIXED;
  DECLARE V2 FIXED;
  DECLARE V3 FIXED;
  DECLARE V4 FIXED;
  DECLARE V5 FIXED;
  DECLARE V6 FIXED;
  DECLARE V7 FIXED;
  DECLARE V8 FIXED;
  DECLARE V9 FIXED;
`);
