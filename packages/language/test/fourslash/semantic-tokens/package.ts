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

//// <|1:RGT005|>: PACKAGE EXPORTS(<|2:RGT005|>);
//// <|3:RGT005|>: PROCEDURE() OPTIONS(MAIN);
////   DCL SYSNULL BUILTIN;
//// END <|4:RGT005|>;
//// END <|5:RGT005|>;

semanticTokens.expectAt(1, "function");
semanticTokens.expectAt(2, "function");
semanticTokens.expectAt(3, "function");
semanticTokens.expectAt(4, "function");
semanticTokens.expectAt(5, "function");
