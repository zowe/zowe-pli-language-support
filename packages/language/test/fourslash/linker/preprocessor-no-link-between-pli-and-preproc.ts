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
 Must not link between PL/I and preprocessor variables
 */

// @wrap: main
//// %DECLARE <|1:PAYROLL|> CHARACTER;
//// %<|2:PAYROLL|> = 'PAY_ROLL';
//// DCL PAYROLL CHAR(8) VALUE("PAYROLL");
//// %DEACTIVATE <|3:PAYROLL|>;
//// PUT(<|1><|2><|3>PAYROLL);

linker.expectNoLinksAt("1");
linker.expectNoLinksAt("2");
linker.expectNoLinksAt("3");
