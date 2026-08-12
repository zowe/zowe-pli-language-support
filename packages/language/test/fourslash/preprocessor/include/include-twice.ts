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

/**
 * Including the same file twice emits its content twice - the serializer must start a new
 * segment for the repeated (re-used) token objects instead of collapsing them into one.
 */

// @filename: cpy/decl2.pli
//// DCL X FIXED;

// @filename: main.pli
//// %INCLUDE "decl2.pli";
//// %INCLUDE "decl2.pli";

preprocessor.expectTokens(`
  DCL X FIXED;
  DCL X FIXED;
`);
