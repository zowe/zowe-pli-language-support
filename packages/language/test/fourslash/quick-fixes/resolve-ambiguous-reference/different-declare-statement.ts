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

//// DCL S FIXED;
//// DCL 1 A,
////       2 B FIXED;
//// DCL 1 AA,
////       2 B FIXED,
////       2 C (S REFER(<|B|>));

verify.noDiagnostics("B", code.Severe.IBM1881I);
await verify.noCodeActions("B");
