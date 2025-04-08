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

import { describe, test } from "vitest";
import { expectGotoDefinition as expectGotoDefinitionRoot } from "./utils";

/**
 * Helper function to parse a string of PL/I statements,
 * wrapping them in a procedure to ensure they are valid
 */
function expectGotoDefinition(
  params: Parameters<typeof expectGotoDefinitionRoot>[0],
) {
  const text = ` STARTPR: PROCEDURE OPTIONS (MAIN);
${params.text}
 END STARTPR;`;

  return expectGotoDefinitionRoot({
    ...params,
    text,
  });
}

describe("Linking tests", async () => {
  describe("Structured tests", async () => {
    describe("NamedType", async () => {
      // Didrik: I'm unsure what the expected behavior on the mainframe is here.
      test("Must find the type declaration", async () => {
        const text = `
 DEFINE ALIAS AAA;
 DCL <|AAA|> CHAR(1);
 DCL BBB TYPE(<|>AAA);`;

        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });
      });
    });
  });

  describe("Unstructured tests", async () => {
    // IMPORTANT: These tests are currently skipped. Unskip when scoping is resolved.
    // https://github.com/zowe/zowe-pli-language-support/issues/29#issuecomment-2623842079
    describe("Nested procedure label tests", async () => {
      const text = `
 <|OUTER|>: procedure options (main); // outer0
    <|INNER|>: procedure;             // inner0
        call <|>OUTER;                // callOuter0
        call <|>INNER;                // callInner0

        <|OUTER|>: procedure;         // outer1
            call <|>OUTER;            // callOuter1
            call <|>INNER;            // callInner1

            <|INNER|>: procedure;     // inner1
                call <|>OUTER;        // callOuter2
                call <|>INNER;        // callInner2
            END INNER;

            call <|>OUTER;            // callOuter3
            call <|>INNER;            // callInner3
        END OUTER;

        call <|>OUTER;                // callOuter4
        call <|>INNER;                // callInner4
    END INNER;

    call <|>OUTER;                    // callOuter5
    call <|>INNER;                    // callInner5
 end OUTER;

 call <|>OUTER;                       // callOuter6
        `;
      const procedures = {
        outer0: 0,
        inner0: 1,
        outer1: 2,
        inner1: 3,
      };

      const calls = {
        callOuter0: 0,
        callInner0: 1,
        callOuter1: 2,
        callInner1: 3,
        callOuter2: 4,
        callInner2: 5,
        callOuter3: 6,
        callInner3: 7,
        callOuter4: 8,
        callInner4: 9,
        callOuter5: 10,
        callInner5: 11,
        callOuter6: 12,
      };

      const links: Record<number, number[]> = {
        [procedures.outer0]: [
          calls.callOuter0,
          calls.callOuter5,
          calls.callOuter6,
        ],
        [procedures.inner0]: [
          calls.callInner0,
          calls.callInner1,
          calls.callInner4,
          calls.callInner5,
        ],
        [procedures.outer1]: [
          calls.callOuter1,
          calls.callOuter2,
          calls.callOuter3,
          calls.callOuter4,
        ],
        [procedures.inner1]: [calls.callInner2, calls.callInner3],
      };

      for (const [procedure, calls] of Object.entries(links)) {
        for (const call of calls) {
          test.skip("Must find link correct procedure label", async () => {
            await expectGotoDefinition({
              text,
              index: call,
              rangeIndex: +procedure,
            });
          });
        }
      }
    });

    describe("Declaration tests", async () => {
      test("Must handle scoping in prodecures", async () => {
        const text = `
 DCL <|ABC|>;
 CALL <|>ABC;

 OUTER: PROCEDURE;
  DCL <|ABC|>;
  CALL <|>ABC;
 END OUTER;

 DCL <|ABC|>;
 CALL <|>ABC;
`;

        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });

        await expectGotoDefinition({
          text,
          index: 1,
          rangeIndex: 1,
        });

        await expectGotoDefinition({
          text,
          index: 2,
          rangeIndex: 2,
        });
      });

      test("Must handle redeclarations", async () => {
        const text = `
 DCL <|ABC|>;
 CALL <|>ABC;
 DCL <|ABC|>;
 CALL <|>ABC;`;

        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });

        await expectGotoDefinition({
          text,
          index: 1,
          rangeIndex: 1,
        });
      });

      test("Must find declaration in SELECT/WHEN construct", async () => {
        // Taken from code_samples/PLI0001.pli
        const text = `
 SELECT (123);
    WHEN (123)
    DO;
        DCL <|BFSTRING|> CHAR(255);
        PUT SKIP LIST(<|>BFSTRING);
    END;
 END;`;

        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });
      });
    });

    describe("Declarations and labels combined", async () => {
      const text = `
 Control: procedure options(main);
  call <|>A('ok!'); // invoke the 'A' subroutine
 end Control;
 <|A|>: procedure (VAR1);
 declare <|VAR1|> char(3);
 put skip list(V<|>AR1);
 end <|>A;`;

      test("Must find declared procedure label in CALL", async () => {
        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });
      });

      test("Must find declared procedure label in END", async () => {
        await expectGotoDefinition({
          text,
          index: 2,
          rangeIndex: 0,
        });
      });

      test("Must find declared variable", async () => {
        await expectGotoDefinition({
          text,
          index: 1,
          rangeIndex: 1,
        });
      });
    });

    describe("Qualified names", async () => {
      const text = `
0DCL 1  <|TWO_DIM_TABLE|>,
        2  <|TWO_DIM_TABLE_ENTRY|>          CHAR(32);
0DCL 1  TABLE_WITH_ARRAY,
        2  ARRAY_ENTRY(0:1000),
           3  NAME                          CHAR(32) VARYING,
           3  TYPE#                         CHAR(8),
        2  NON_ARRAY_ENTRY,
           3  NAME                          CHAR(32) VARYING,
           3  <|TYPE#|>                     CHAR(8);

 DCL ARRAY_ENTRY;
 DCL TWO_DIM_TABLE_ENTRY;

 PUT (<|>TWO_DIM_TABLE);
 PUT (TWO_DIM_TABLE.<|>TWO_DIM_TABLE_ENTRY);
 PUT (TABLE_WITH_ARRAY.ARRAY_ENTRY(0).<|>TYPE#);`;

      test("Must find table name in table", async () => {
        await expectGotoDefinition({
          text,
          index: 0,
          rangeIndex: 0,
        });
      });

      // TODO: Fix qualified name scoping
      test.skip("Must find qualified name in table", async () => {
        await expectGotoDefinition({
          text,
          index: 1,
          rangeIndex: 1,
        });
      });

      test("Must find qualified name in array", async () => {
        await expectGotoDefinition({
          text,
          index: 2,
          rangeIndex: 2,
        });
      });
    });
  });
});
