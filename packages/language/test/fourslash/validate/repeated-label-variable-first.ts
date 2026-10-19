/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I);
