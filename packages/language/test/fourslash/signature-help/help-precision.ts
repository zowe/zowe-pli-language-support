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

/// <reference path="../framework.ts" />

//// %DCL A CHARACTER;
//// %A = SUBSTR<|a>(<|b>
////    <|c>    <|d>"NU<|e>LL"<|f>,
////        <|g>1  <|h>,<|i>
////      <|j>  2
//// <|k>)<|l>;<|m>

signatureHelp.expectNoHelp("a");
signatureHelp.expectParameterIndexAt("b", 0);
signatureHelp.expectParameterIndexAt("c", 0);
signatureHelp.expectParameterIndexAt("d", 0);
signatureHelp.expectParameterIndexAt("e", 0);
signatureHelp.expectParameterIndexAt("f", 0);

signatureHelp.expectParameterIndexAt("g", 1);
signatureHelp.expectParameterIndexAt("h", 1);

signatureHelp.expectParameterIndexAt("i", 2);
signatureHelp.expectParameterIndexAt("j", 2);
signatureHelp.expectParameterIndexAt("k", 2);

signatureHelp.expectNoHelp("l"); //; belongs to the statement, not the call
signatureHelp.expectNoHelp("m");
