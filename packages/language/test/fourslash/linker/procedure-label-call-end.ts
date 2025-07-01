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

/**
 * Must find declared procedure label in CALL/END
 */

// @wrap: main
//// Control: procedure options(main);
////  call <|1>A('ok!'); // invoke the 'A' subroutine
//// end Control;
//// <|1:A|>: procedure (VAR1);
//// declare <|2:VAR1|> char(3);
//// put skip list(V<|2>AR1);
//// end <|1>A;

linker.expectLinks();
