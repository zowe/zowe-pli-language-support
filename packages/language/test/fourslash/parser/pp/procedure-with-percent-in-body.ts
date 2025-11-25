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

//// %TEST: PROC;
////   <|%|>DCL I FIXED;
//// %END;

// The DCL statement uses an illegal % character, so we expect a parser error
verify.expectErrorCodesAt("%", code.Severe.IBM3762I);
// But the content of the procedure should still be parsed correctly
verify.expectPPAst({
  kind: Syntax.ProcedureStatement,
  labels: ["TEST"],
  statements: [
    {
      kind: Syntax.DeclareStatement,
      items: [
        {
          kind: Syntax.DeclaredItem,
          elements: [
            {
              kind: Syntax.DeclaredVariable,
              name: "I",
            },
          ],
          attributes: [
            {
              kind: Syntax.ComputationDataAttribute,
              type: constants.DefaultAttribute.FIXED,
            },
          ],
        },
      ],
    },
  ],
  end: {
    kind: Syntax.EndStatement,
  },
});
