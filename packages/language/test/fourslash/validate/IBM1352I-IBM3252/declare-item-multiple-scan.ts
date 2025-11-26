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

//// %DCL x char SCAN <|1:RESCAN|>;
//// RGT005: PROCEDURE() OPTIONS(MAIN);
////   DCL T fixed <|2:scan|> <|3:scan|>;
//// END RGT005;

verify.expectDiagnosticsAt(1, {
  message: code.Warning.IBM3252I.message("RESCAN"),
});
verify.expectDiagnosticsAt([2, 3], {
  message: code.Error.IBM1352I.message("SCAN"),
});
