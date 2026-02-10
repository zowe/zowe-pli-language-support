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

// In case of a linking ambiguity, ensure that the LSP links to all possible targets.

// @wrap: main
//// DCL 1 A, 2 <|C|>;
//// DCL 1 B, 2 <|C|>;
//// PUT(<|C>C);

linker.expectLinks();
