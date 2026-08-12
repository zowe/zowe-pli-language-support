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

// @filename: cpy/execinc.pli
//// DCL LIB_VAR FIXED;

// @filename: main.pli
//// TEST: PROC;
////   %DCL <|TEST_VAR|> CHAR INIT("INCLUDE EXECINC");
////   EXEC SQL <|TEST_VAR>TEST_VAR;
//// END;

verify.noParserDiagnostics();
preprocessor.expectTokens(`
    TEST: PROC;
      DCL LIB_VAR FIXED;
    END;    
`);
linker.expectLinks();
