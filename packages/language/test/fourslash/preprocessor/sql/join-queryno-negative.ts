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

/// <reference path="../../framework.ts" />

//// JOINTEST: PROC OPTIONS(MAIN);
////   DCL DEPT FIXED BIN(31) INIT(1);
////   EXEC SQL DECLARE C1 CURSOR FOR
////     SELECT E.EMP_ID
////       FROM EMPLOYEE E
////       JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID
////       WHERE D.DEPT_ID = :DEPT
////       FOR FETCH ONLY
////       WITH UR
////       QUERYNO <|queryno:'ABC'|>;
//// END JOINTEST;

verify.expectExclusiveDiagnosticsAt("queryno", {
  message: "mismatched input ''ABC'' expecting INTEGERLITERAL",
  source: languages.Db2Sql,
  severity: constants.Severity.E,
});
verify.noDiagnosticsExcept([
  /mismatched input ''ABC'' expecting INTEGERLITERAL/,
]);
