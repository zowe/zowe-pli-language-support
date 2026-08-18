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

//// <|function:EXAMPLE|>: PROC;
//// <|function:SOME_ENTRY|>: ENTRY(C) RETURNS(CHAR(11) VAR);
//// CALL <|function:SOME_ENTRY|>(42);
//// END <|function:EXAMPLE|>;

semanticTokens.expectAt("function");
