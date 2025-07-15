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
 Repeated declaration of label is invalid (variable label first)
 */
// @wrap: main
//// DCL <|1:A|> CHAR(8) INIT("A");
//// A: PROCEDURE;
//// END A;

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I.fullCode);
