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

//// %dcl A char;
//// %A = '';
//// dcl A%;C fixed bin(31);

preprocessor.expectTokens(["dcl", "C", "fixed", "bin", "(", "31", ")", ";"]);
