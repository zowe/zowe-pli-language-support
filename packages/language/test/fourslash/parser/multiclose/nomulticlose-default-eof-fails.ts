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

//// P: PROCEDURE OPTIONS(MAIN);
////    DO;
////       PUT SKIP LIST('HELLO');
//// <|EOF|>

// Verify that the parser reports specific error message for missing END token at EOF (default is NOMULTICLOSE)
verify.expectDiagnosticsAt("EOF", {
  message: 'Expected token "END", but received end of file instead.',
});
