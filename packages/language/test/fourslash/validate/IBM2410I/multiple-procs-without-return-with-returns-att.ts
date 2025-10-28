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

// @wrap: main
//// MAINPR: proc options( main );
////    b: proc returns( OPTIONAL byvalue fixed bin(31) );
////        return(32);
////    end b;
////    call b();
////    c: proc;
////        return(32);
////    end c;
////    call c();
////    d: proc returns( OPTIONAL byvalue fixed bin(31) );
////        return;
////    end d;
////    call d();
////    target: <|1:proc|> returns( OPTIONAL byvalue fixed bin(31) );
////    end target;
////    call target();
//// end MAINPR;

verify.expectExclusiveErrorCodesAt(1, code.Error.IBM2410I); // Has no RETURN, has RETURNS -> must have RETURN (...)
