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

// Under RULES(MULTICLOSE), one `END OUTER;` closes INNER and OUTER at once. The host
// variable sits in INNER right before that END and must resolve in INNER's scope.

////*PROCESS RULES(MULTICLOSE);
//// OUTER: PROC;
////   INNER: PROC;
////     DCL <|1:I|> FIXED BIN(31);
////     EXEC SQL SELECT 1 INTO :<|1>I FROM T;
//// END OUTER;

// The multiclose itself is legitimately flagged (IBM1120I) - only linking must be clean.
verify.noParserErrors();
verify.noLinkingDiagnostics();
linker.expectLinks();
