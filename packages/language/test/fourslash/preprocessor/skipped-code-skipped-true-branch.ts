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
//// IGNO: PROCEDURE OPTIONS (MAIN);
//// dcl A fixed bin(31);
//// dcl B fixed bin(31);
//// dcl WHAT fixed bin(31);
//// %DECLARE C fixed;
//// %C = 0;
//// %IF C %THEN <|skipped:%DO;
////   WHAT = 123;
//// %END;|>
//// %ELSE %DO;
////   WHAT = 456;
//// %END;
//// END;

preprocessor.expectSkippedCodeAt("skipped");
