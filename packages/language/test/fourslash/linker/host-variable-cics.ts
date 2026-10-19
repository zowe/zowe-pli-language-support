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
 * Go-to-definition on an `EXEC CICS` host-variable reference resolves to its `DCL` -
 * the CICS twin of `host-variable.ts` (EXEC SQL).
 */
// @wrap: main
//// DCL <|1:COMM_AREA|> CHAR(100);
//// EXEC CICS LINK PROGRAM('PGM01') COMMAREA(<|1>COMM_AREA);

verify.noParserDiagnostics();
linker.expectLinks();
