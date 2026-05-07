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

/// <reference path="../../framework.ts" />

/**
 * Test that a variable named END can be used without being confused with END statement.
 * The parser should not treat "END = ..." as an END statement.
 */

//// TEST: PROC OPTIONS(MAIN);
////    DCL END CHAR(20);
////    END = 'HELLO_WORLD';
////    PUT SKIP LIST(END);
//// END TEST;

verify.noParserDiagnostics();
