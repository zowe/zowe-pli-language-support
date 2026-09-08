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

// A host variable named like a PL/I keyword that also occurs in the generated
// replacement text (`DO; END;`) must still link to its own declaration.
// @wrap: main
//// DCL <|1:DO|> FIXED;
//// EXEC SQL SELECT 1 INTO :<|1>DO FROM T;

verify.noParserDiagnostics();
linker.expectLinks();
