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

/**
 * Must link to procedure label before declaration
 */

// @wrap: main
//// CALL <|1>OUTER;
////
//// <|1:OUTER|>: PROCEDURE;
////  PUT("INSIDE");
//// END <|1>OUTER;
////
//// CALL <|1>OUTER;

linker.expectLinks();
