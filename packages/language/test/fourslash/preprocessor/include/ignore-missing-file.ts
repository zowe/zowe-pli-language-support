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

// @filename: main.pli
//// DECLARE BEFORE CHARACTER;
//// %INCLUDE MISSING;
//// DECLARE AFTER CHARACTER;

/* Should still return the other tokens before/after the erroneous include */
preprocessor.expectTokens(`
  DECLARE BEFORE CHARACTER;
  DECLARE AFTER CHARACTER;
`);
