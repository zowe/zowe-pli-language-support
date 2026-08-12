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

/**
 * An `EXEC SQL` statement inside an `%INCLUDE`d file is replaced by the SQL phase (the
 * exec phases scan the whole composed text, including foreign include spans), and its
 * host-variable reference still links back to the declaration in the same include.
 */

// @filename: cpy/execinc.pli
//// DCL <|1:HOST_V|> FIXED BIN(31);
//// EXEC SQL SELECT A INTO :<|1>HOST_V FROM T;

// @filename: main.pli
//// TEST: PROC;
////   %INCLUDE "execinc.pli";
//// END;

verify.noParserDiagnostics();
preprocessor.containsTokens(["HOST_V", "DO", ";", "END", ";"]);
linker.expectLinks();
