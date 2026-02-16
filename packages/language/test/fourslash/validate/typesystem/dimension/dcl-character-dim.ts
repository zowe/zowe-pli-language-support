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

//// DCL ANYTHING(<|str:'hello'|>) FIXED BIN;
//// //TODO DCL ANYTHING(<|pic:P'AAA99X'|>) FIXED BIN;
//// DCL ANYTHING(<|wide:'3100'wx|>) FIXED BIN;

verify.expectDiagnosticsAt("str", {
  message:
    "CONVERSION condition with ONCODE= 612 raised while evaluating restricted expression.",
});
verify.expectDiagnosticsAt("wide", {
  message:
    "CONVERSION condition with ONCODE= 676 raised while evaluating restricted expression.",
});
