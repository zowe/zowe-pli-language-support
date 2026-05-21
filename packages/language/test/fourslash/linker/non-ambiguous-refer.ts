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

// @wrap: main
//// DCL   a            FIXED BIN(31);
//// DCL   p            POINTER;
//// DCL 1 s,
////       2 len        FIXED BIN(31);
//// DCL 1 t            BASED(p),
////       2 <|len|>    FIXED BIN(31),
////       2 buff(a REFER(<|len>len));

linker.expectLinks();
verify.noDiagnostics("len");
