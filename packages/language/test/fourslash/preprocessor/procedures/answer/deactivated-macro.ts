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

// @compiler: true
//// %Deactivated_macro: procedure returns( character );
////   return( 'DCL DEACTIVATED FIXED;' );
//// %end;
//// %MYMACRO: PROC;
////   ANSWER (Deactivated_macro);
//// %END;
//// %DEACTIVATE Deactivated_macro;
//// %ACTIVATE MYMACRO;
//// ppp: PROC;
////   MYMACRO
//// END;

preprocessor.expectTokens(`
    ppp: PROC; 
        DCL DEACTIVATED FIXED;
    END;
`);
