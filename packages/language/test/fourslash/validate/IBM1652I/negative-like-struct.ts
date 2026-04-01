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

// @wrap: main
//// DCL A <|1:LIKE|> B;
//// DCL 1 B, 2 C <|2:LIKE|> D;
//// DCL 1 D, 2 E CHAR(8);

// Even though the issue description says it is about nested LIKE
// The compiler will only flag LIKE attributes if they are cyclic
// Meaning that, we don't expect an error here
verify.noDiagnostics(1, code.Severe.IBM1652I);
verify.noDiagnostics(2, code.Severe.IBM1652I);
