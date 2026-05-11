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

// @compiler: true
// @wrap: main
//// DCL <|1:ABc|> CHAR(8);
//// PUT(<|1>ABC);
//// PUT(<|1>ABc);
//// PUT(<|1>AbC);
//// PUT(<|1>aBC);
//// PUT(<|1>aBc);
//// PUT(<|1>abC);
//// PUT(<|1>Abc);
//// PUT(<|1>abc);

linker.expectLinks();
