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

//// /** JSDoc description :) */
//// XXX: PROC RETURNS(CHARACTER); END;
//// DCL A CHARACTER;
//// A = <|1>XXX();

//the JSDoc will be ignored since it's not a builtin
hover.expectMarkdownAt(
  1,
  hover.codeBlock(`XXX: PROC RETURNS(CHARACTER); END;`),
);
