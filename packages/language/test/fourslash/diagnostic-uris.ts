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

/// <reference path="framework.ts" />

// @filename: main.pli
//// INTERNAL: PACKAGE EXPORTS(TB0001);
//// TB0001: PROCEDURE() OPTIONS(MAIN);
////   DCL  P1     POINTER;
////   P1 = <|1:SYSNULL|>;
//// END TB0001;
//// END INTERNAL;

testAPI.testBuilder.getDiagnostics().forEach((diagnostic) => {
  diagnostic.uri = "file:///sysnull.pli";
});
verify.expectToThrow(
  () => testAPI.testBuilder.checkDiagnosticsURIs(),
  code.Internal.DiagnosticURIMismatch.message(
    "1",
    "main.pli",
    "file:///sysnull.pli",
  ),
);
