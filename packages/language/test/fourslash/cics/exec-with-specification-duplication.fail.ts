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

//// EXEC CICS LINK
////   <|1:PROGRAM|>("TEST")
////   <|2:PROGRAM|>("TEST2")
////   <|3:PROGRAM|>("TEST3");

verify.noDiagnostics("1");
verify.expectDiagnosticsAt("2", code.LSP.Cics.DuplicatedSpecification);
verify.expectDiagnosticsAt("3", code.LSP.Cics.DuplicatedSpecification);
