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

// @wrap: main
//// DCL 1 <|A|>, 2 <|B|>, 3 <|C|> FIXED(31);
//// DCL <|X|> LIKE <|A>A;
//// DCL Y LIKE <|X>X;
//// PUT(Y.<|B>B);
//// PUT(Y.<|C>C);

linker.expectLinks();
