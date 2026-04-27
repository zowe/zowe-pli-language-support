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

//// %DCL A FIXED;
//// %A = MAX<|0>(<|1>1, <|2>2, <|3>3, <|4>4, <|5>5, <|6>6);

signatureHelp.expectNoHelp("0");
signatureHelp.expectParameterIndexAt("1", 0);
signatureHelp.expectParameterIndexAt("2", 1);
signatureHelp.expectParameterIndexAt("3", 1);
signatureHelp.expectParameterIndexAt("4", 1);
signatureHelp.expectParameterIndexAt("5", 1);
signatureHelp.expectParameterIndexAt("6", 1);
signatureHelp.expectMarkdownParameterAt(
  "1",
  `\`value1: FIXED\`

First expression. \`value1\` should have
\`FIXED\` type, and if not, it will be converted thereto.`,
);
const parameter2Documentation = `\`valueN: FIXED LIST\`

Second and subsequent expressions.
Each \`valueN\` should have \`FIXED\` type, and if not, it will
be converted thereto.`;
signatureHelp.expectMarkdownParameterAt("3", parameter2Documentation);
signatureHelp.expectMarkdownParameterAt("6", parameter2Documentation);
