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

/// <reference path="../../../framework.ts" />

//// %Deactivated_macro: procedure returns( character );
////   return( '** value of deactivated macro **' );
//// %end;
//// %deact Deactivated_macro;
//// %MYMACRO: PROC;
////   ANSWER (Deactivated_macro);
//// %END;
//// %DCL X CHAR;
//// %X = MYMACRO;
//// X

preprocessor.expectTokens("** VALUE OF DEACTIVATED MACRO **");
