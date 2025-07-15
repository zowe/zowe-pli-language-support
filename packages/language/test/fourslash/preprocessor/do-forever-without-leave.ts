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

/*
  This might be an intermediate step in the development of a DO FOREVER loop
  The preprocessor should eventually terminate anyway
*/
//// %DO %FOREVER;
////   /* EVENTUALLY TERMINATE */
//// %END;
//// DCL VAR CHARACTER;

preprocessor.expectTokens(" DCL VAR CHARACTER;");
