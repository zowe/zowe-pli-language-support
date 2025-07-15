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
 * Must ignore case differences
 */

// @wrap: main
//// DCL <|1:ABc|>;
//// CALL <|1>ABC;
//// CALL <|1>ABc;
//// CALL <|1>AbC;
//// CALL <|1>aBC;
//// CALL <|1>aBc;
//// CALL <|1>abC;
//// CALL <|1>Abc;
//// CALL <|1>abc;

linker.expectLinks();
