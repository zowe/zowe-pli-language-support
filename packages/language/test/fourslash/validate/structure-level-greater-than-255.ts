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
 Structure level greater than 255 is invalid
 */
// @wrap: main
//// DCL 1 A,
////       <|a:256|> B;

verify.expectExclusiveErrorCodesAt("a", code.Error.IBM1363I.fullCode);
