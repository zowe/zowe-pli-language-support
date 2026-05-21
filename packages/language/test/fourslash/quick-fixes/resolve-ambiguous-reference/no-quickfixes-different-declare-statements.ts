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

//// DCL P BIN FIXED;
//// DCL 1 X,
////       2 Y1,
////         3 Z FIXED;
//// DCL 1 X,
////       2 Y1,
////         3 Z FIXED,
////       2 Y3 (P REFER(<|Z|>));

verify.noDiagnostics("Z", code.Severe.IBM1881I);
await verify.noCodeActions("Z");
