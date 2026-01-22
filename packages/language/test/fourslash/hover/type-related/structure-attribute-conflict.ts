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

//// DCL 1 <|1>PERSON STATIC <|AUTO|>,
////       2 NAME CHAR(20),
////       2 AGE FIXED DEC(3);

hover.expectMarkdownAt(
  1,
  hover.codeBlock(`DCL 1 PERSON STATIC,
      2 NAME CHARACTER(20),
      2 AGE FIXED DECIMAL PRECISION(3);`),
);
verify.expectDiagnosticsAt("AUTO", code.Error.IBM2462I);
