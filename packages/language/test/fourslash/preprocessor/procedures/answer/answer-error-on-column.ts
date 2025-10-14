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

//// %MYMACRO: PROC;
////   ANSWER ('123') <|1:COLUMN|> ('hallo');
//// %END;
//// %ACTIVATE MYMACRO;
//// ppp: PROC;
////   MYMACRO
//// END;

verify.expectDiagnosticsAt(1, code.Severe.IBM3948I);
