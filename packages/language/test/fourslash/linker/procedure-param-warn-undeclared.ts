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
 * A parameter without explicit declaration is considered as implicitly declared.
 */

//// PLEA: PROCEDURE(<|1:PARAM1|>, <|2:PARAM2|>);
////  DCL PARAM1 FIXED;
//// END PLEA;

verify.noDiagnostics(1);
verify.expectExclusiveErrorCodesAt(2, code.Error.IBM1373I.fullCode);
