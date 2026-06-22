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

// @filename: cpy/nested_one.pli
//// this makes no sense!!! I am not even a valid PLI file :-(

// @filename: cpy/lib_one.pli
//// %INCLUDE <|1:"nested_one.pli"|>;

// @filename: cpy/nested_two.pli
//// this makes no sense!!! I am not even a valid PLI file :-(

// @filename: cpy/lib_two.pli
//// %INCLUDE <|2:"nested_two.pli"|>;

// @filename: cpy/including.pli
//// %INCLUDE <|3:"lib_one.pli"|>;
//// %INCLUDE <|4:"lib_two.pli"|>;

verify.expectDiagnosticsAt(1, [
  {
    severity: 2,
    message: "Included file './cpy/nested_one.pli' contains 3 lexing errors.",
  },
  {
    severity: 2,
    message: "Included file './cpy/nested_one.pli' contains 1 parsing errors.",
  },
]);

//no parsing error: will be shadowed by label 1 parsing error
verify.expectDiagnosticsAt(2, [
  {
    severity: 2,
    message: "Included file './cpy/nested_two.pli' contains 3 lexing errors.",
  },
]);

//no errors, since we do not propagate errors from nested includes, yet
verify.expectDiagnosticsAt(3, []);
verify.expectDiagnosticsAt(4, []);
