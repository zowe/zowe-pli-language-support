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
//// DCL <|READY|>(2) LABEL;
//// DCL <|GOTO|> FIXED INIT(1);
//// GO TO <|READY>READY(<|GOTO>GOTO);

verify.noParserDiagnostics();
linker.expectLinks();
