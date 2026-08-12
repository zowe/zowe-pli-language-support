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
 * The macro generates an additional usage of `X` (`X = 1;`), which only exists in
 * generated text - find-references must report the declaration and the real-source usage
 * only, not a collapsed whitespace location for the generated one.
 */
//// %MYMACRO: PROC;
////   ANSWER ('X = 1;');
//// %END;
//// %ACTIVATE MYMACRO;
//// TEST: PROC;
//// DCL <|1:X|> FIXED;
//// MYMACRO
//// <|1>X = 2;
//// END;

linker.expectReferences();
