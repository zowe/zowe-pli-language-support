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

//// %TEST: PROC (VAR) RETURNS (CHAR);
////   RETURN (VAR);
//// %END;
//// %DCL Y CHAR;
//// // No arguments received, should simply yield no tokens
//// %Y = TEST();
//// Y

/* Actually expect no tokens here, all the text is preprocessor code */
preprocessor.expectTokens([]);
