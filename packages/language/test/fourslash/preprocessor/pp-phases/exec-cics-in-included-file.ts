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
 * An `EXEC CICS` statement inside an `%INCLUDE`d file is replaced by the CICS phase, and
 * the `DFH*` runtime declarations are inserted at the *main* file's enclosing procedure -
 * the insertion anchor lives in a different file than the statement that triggers it.
 */

// @filename: cpy/cicsinc.pli
//// EXEC CICS ABEND ABCODE('$CAN');

// @filename: main.pli
//// TEST: PROC;
////   %INCLUDE "cicsinc.pli";
//// END;

verify.noParserDiagnostics();
preprocessor.containsTokens(["DFHEIBLK", "EIBRESP", "DO", ";", "END", ";"]);
