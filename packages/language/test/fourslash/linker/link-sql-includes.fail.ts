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

// @wrap: main
//// EXEC SQL INCLUDE SQLCA;
//// EXEC SQL INCLUDE SQLDA;
//// PUT(<|1:SQLCA|>.<|2:SQLCODE|>);
//// PUT(<|3:SQLDA|>.<|4:SQLTYPE|>);
//// PUT(<|5:SQLCODE|>);
//// PUT(<|6:SQLTYPE|>);

// Should link to the SQLCA/SQLDA builtin copybook definition
// Therefore, no diagnostics expected
verify.noDiagnostics([1, 2, 3, 4, 5, 6]);
