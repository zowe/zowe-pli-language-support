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
 * An unbounded loop that doubles a macro variable and emits it on every iteration must
 * terminate: without the value cap the string reaches the engine's maximum length after
 * ~30 iterations, while the instruction budget allows thousands of them.
 */
//// %DCL S CHAR;
//// %S = 'A';
//// %DO WHILE('1'B);
////   %S = <|1:S || S|>;
////   %ANSWER(S);
//// %END;

verify.expectDiagnosticsAt(1, code.LspCodes.ValueTooLarge);
