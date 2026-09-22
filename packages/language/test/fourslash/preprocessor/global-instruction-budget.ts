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
 * The runaway guard is one budget for the whole run, not one per instruction node. Each
 * loop below stays well inside the configured limit on its own, so a per-node counter
 * never tripped and a file could multiply its interpreted work by the number of loops
 * it contains.
 */
//// %DCL I FIXED;
//// %DCL X FIXED;
//// %X = 0;
//// %DO I = 1 TO 4000;
////   %X = X + 1;
//// %END;
//// %ACT X;
//// X
//// %DO I = 1 TO 4000;
////   %X = X + 1;
//// %END;
//// %DO I = 1 TO 4000;
////   %X = X + 1;
//// %END;
//// %DO I = 1 TO 4000;
////   %X = X + 1;
//// %END;
//// X

// The first loop is well within the budget and runs to completion.
preprocessor.containsTokens("4000");
// The remaining loops exhaust the shared budget, so the total of 16000 iterations is
// never reached.
preprocessor.not.containsTokens("16000");
