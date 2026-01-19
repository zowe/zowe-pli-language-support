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

//// DCL MyVar FIXED <|2:FLOAT|>;
//// <|1>MyVar = 12.1234;

hover.expectMarkdownAt(
  1,
  //will not show FLOAT attribute due to conflict
  hover.codeBlock("DCL MYVAR FIXED;"),
);
verify.expectDiagnosticsAt(2, code.Error.IBM2462I);
