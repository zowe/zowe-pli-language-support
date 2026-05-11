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

// @compiler: true
//// %REPLACE X WITH "HELLO "" WORLD""";
//// DCL A CHAR INIT(X);

// Expect the string to be replaced, including quotation marks and escaping of internal quotes
preprocessor.expectTokens('DCL A CHAR INIT("HELLO "" WORLD""");');
