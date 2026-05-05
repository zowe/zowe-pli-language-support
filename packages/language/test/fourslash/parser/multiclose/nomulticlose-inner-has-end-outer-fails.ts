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

////*PROCESS RULES(NOMULTICLOSE);
//// P: PROCEDURE OPTIONS(MAIN);
////    DCL I FIXED BIN(31);
////    DO I = 1 TO 10;
////       PUT SKIP LIST('HELLO');
////    END;
//// <|EOF|>

// DO has its END, but PROCEDURE is missing END - still fails at EOF
verify.expectDiagnosticsAt("EOF", {
  message: 'Expected token "END", but received end of file instead.',
});
