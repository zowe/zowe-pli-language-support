/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../framework.ts" />

//// %DCL A CHARACTER;
//// %A = SUBSTR<|none>(<|arg0>
////    <|arg0>    <|arg0>"NU<|e>LL"<|arg0>,
////        <|arg1>1  <|arg1>,<|arg2>
////      <|arg2>  2
//// <|arg2>)<|none>;<|none>

signatureHelp.expectNoHelp("none");
signatureHelp.expectParameterIndexAt("arg0", 0);
signatureHelp.expectParameterIndexAt("arg1", 1);
signatureHelp.expectParameterIndexAt("arg2", 2);
