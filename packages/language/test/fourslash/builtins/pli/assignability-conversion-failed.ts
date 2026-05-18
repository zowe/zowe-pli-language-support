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

// The actual compiler does not throw here at all
// @compiler: skip
// @wrap: main
//// DCL XXX FIXED;
//// DCL YYY CHARACTER(8) INITIAL("abc");
//// XXX = <|MAX|>(YYY, 2, 3);

verify.expectDiagnosticsAt("MAX", code.Severe.IBM3948I);
