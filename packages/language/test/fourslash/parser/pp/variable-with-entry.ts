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

//// %DCL VAR <|entry:ENTRY|>;

verify.noDiagnostics("entry");

verify.expectPPAst({
  kind: Syntax.DeclareStatement,
  items: [
    {
      kind: Syntax.DeclaredItem,
      elements: [
        {
          kind: Syntax.DeclaredVariable,
          name: "VAR",
        },
      ],
      attributes: [
        {
          kind: Syntax.EntryAttribute,
        },
      ],
    },
  ],
});
