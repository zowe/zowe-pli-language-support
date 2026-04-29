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

//// DEFINE ORDINAL Color ( Red, Green, Blue );
//// DCL XXX ORDINAL Color;
//// XXX = LAST(:<|arg0>Color:);

verify.noDiagnostics();
signatureHelp.expectParameterIndexAt("arg0", 0);
signatureHelp.expectMarkdownParameterAt(
  "arg0",
  `\`t: ANY\`

Name of an ordinal type`,
);
