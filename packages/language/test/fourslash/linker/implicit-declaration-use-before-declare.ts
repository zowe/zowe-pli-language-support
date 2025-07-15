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
//// PUT(<|1><|2:A|>);
//// <|1:A|> = 123;

verify.expectExclusiveErrorCodesAt(2, code.Warning.IBM1085I.fullCode);
linker.expectLinks();
