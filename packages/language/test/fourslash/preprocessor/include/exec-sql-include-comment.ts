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
 * An `EXEC SQL INCLUDE`d file gets the same comment-stripping as the entry file before the
 * raw-text `EXEC` scan runs over it - a commented-out `EXEC SQL` statement inside the
 * copybook must not be matched and replaced.
 */

// @filename: cpy/cmt.pli
//// DECLARE CMT_VAR FIXED;
//// /* EXEC SQL SELECT 1 INTO :X FROM T; */

// @filename: main.pli
//// EXEC SQL INCLUDE cmt;

preprocessor.expectTokens(`
  DECLARE CMT_VAR FIXED;
`);
