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
//// MAINPR: <|1:proc|> options( main );
////    b: <|2:proc|> returns( OPTIONAL byvalue fixed bin(31) );
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
////    e: proc returns( OPTIONAL byvalue fixed bin(31) );
////    end e;
////    call e();
//// end MAINPR;

verify.noDiagnostics(1); // No RETURN, no RETURNS -> ok
verify.noDiagnostics(2); // Has RETURN, has RETURNS -> ok
