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

////*PROCESS DEPRECATENEXT(STMT(GOTO));
////  %DCL X FIXED;
////  %<|1:GOTO|> L1;
////  %L1:;
////  %X = 1;
////  <|2:GOTO|> L2;
////  L2:;

verify.noDiagnostics(1, code.Warning.IBM2647I);
verify.expectDiagnosticsAt(2, code.Warning.IBM2647I);
