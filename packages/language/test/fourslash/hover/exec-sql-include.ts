/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../framework.ts" />

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// EXEC SQL INCLUDE <|1>lib;

hover.expectMarkdownAt(
  1,
  `\`\`\`pli
%INCLUDE \"./cpy/lib.pli\"
\`\`\`


---
\`\`\`pli
 DECLARE LIB_VAR FIXED;
\`\`\`
`,
);
