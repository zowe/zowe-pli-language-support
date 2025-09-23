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

//// %make: PROC RETURNS (FIXED);
//// %END;
//// %something: PROC;
////   CALL <|1:make|>();
//// %END;
//// %ACTIVATE something;
//// ppp: PROC;
////   DCL VAR FIXED;
////   something
//// END;

verify.expectDiagnosticsAt(1, [
  {
    code: code.Severe.IBM3970I.fullCode,
  },
]);
