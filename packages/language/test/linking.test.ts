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
import { expectLinks as expectLinksRoot } from "./utils";

/**
 * Scoping report: https://github.com/zowe/zowe-pli-language-support/issues/94
 */

/**
 * Helper function to parse a string of PL/I statements,
 * wrapping them in a procedure to ensure they are valid
 */
function expectLinks(text: string) {
  const wrappedText = ` STARTPR: PROCEDURE OPTIONS (MAIN);
${text}
 END STARTPR;`;

  return expectLinksRoot(wrappedText);
}

describe("Linking tests", () => {
  test("Nested procedure label tests", () =>
    expectLinks(`
 <|1:OUTER|>: procedure options (main);
    <|2:INNER|>: procedure;
        call <|3>OUTER;
        call <|2>INNER;

        <|3:OUTER|>: procedure;
            call <|3>OUTER;
            call <|4>INNER;

            <|4:INNER|>: procedure;
                call <|3>OUTER;
                call <|4>INNER;
            END <|4>INNER;

            call <|3>OUTER;
            call <|4>INNER;
        END <|3>OUTER;

        call <|3>OUTER;
        call <|2>INNER;
    END <|2>INNER;

    call <|1>OUTER;
    call <|2>INNER;
 end <|1>OUTER;
 call <|1>OUTER;`));

  test("Must handle implicit declaration (use before declaration)", () =>
    expectLinks(`
 DCL <|1:A|> CHAR(8) INIT("A");
 PUT(<|1>A); // -> "A"

 LABL: PROCEDURE;
   PUT(<|2>A); // -> "A2"
   DCL <|2:A|> CHAR(8) INIT("A2");
   PUT(<|2>A); // -> "A2"
 END LABL;

 PUT(<|1>A); // -> "A"
 CALL LABL;
 PUT(<|1>A); // -> "A"
`));

  test("Must handle implicit declaration (use before declaration)", () =>
    expectLinks(`
 PUT(<|1>A);
 DCL <|1:A|> CHAR(8) INIT("A");
 PUT(<|1>A);
`));

  test("Must handle scoping in prodecures", () =>
    expectLinks(`
 DCL <|1:ABC|>;
 CALL <|1>ABC;

 OUTER: PROCEDURE;
  DCL <|2:ABC|>;
  CALL <|2>ABC;
 END OUTER;

 DCL ABC;
 CALL <|1>ABC;
`));

  test("Must ignore redeclarations", () =>
    expectLinks(`
 DCL <|1:ABC|>;
 CALL <|1>ABC;
 DCL ABC;
 CALL <|1>ABC;`));

  test("Must find declaration in SELECT/WHEN construct", () =>
    // Taken from code_samples/PLI0001.pli
    expectLinks(`
 SELECT (123);
    WHEN (123)
    DO;
        DCL <|1:BFSTRING|> CHAR(255);
        PUT SKIP LIST(<|1>BFSTRING);
    END;
 END;`));

  test("Must find declared procedure label in CALL/END", () =>
    expectLinks(`
          Control: procedure options(main);
           call <|1>A('ok!'); // invoke the 'A' subroutine
          end Control;
          <|1:A|>: procedure (VAR1);
          declare <|2:VAR1|> char(3);
          put skip list(V<|2>AR1);
          end <|1>A;`));

  test("Qualified names", () =>
    expectLinks(`
 DCL ARRAY_ENTRY;
 DCL TWO_DIM_TABLE_ENTRY;
 DCL TYPE#;

 DCL 1  <|1:TWO_DIM_TABLE|>,
        2  <|2:TWO_DIM_TABLE_ENTRY|>          CHAR(32);
 DCL 1  TABLE_WITH_ARRAY,
        2  ARRAY_ENTRY(0:1000),
           3  NAME                          CHAR(32) VARYING,
           3  <|3:TYPE#|>                     CHAR(8),
        2  NON_ARRAY_ENTRY,
           3  NAME                          CHAR(32) VARYING,
           3  <|4:TYPE#|>                     CHAR(8);

 DCL ARRAY_ENTRY;
 DCL TWO_DIM_TABLE_ENTRY;
 DCL TYPE#;

 PUT (<|1>TWO_DIM_TABLE);
 PUT (TWO_DIM_TABLE.<|2>TWO_DIM_TABLE_ENTRY);
 PUT (TABLE_WITH_ARRAY.ARRAY_ENTRY(0).<|3>TYPE#);
 PUT (TABLE_WITH_ARRAY.NON_ARRAY_ENTRY.<|4>TYPE#);`));

  describe("Implicit qualification", () => {
    test("Must qualify implicitly in structure", () =>
      expectLinks(`
 DCL 1 <|1:A|>,
     2 <|2:B|> CHAR(8) VALUE("B");
 PUT(<|2>B);
 PUT(<|1>A.<|2>B);
`));

    test("Declaration must override implicit qualification", () =>
      expectLinks(`
 DCL 1 <|1:A|>,
     2 <|2:B|> CHAR(8) VALUE("B");
 DCL <|3:B|> CHAR(8) VALUE("B2");
 PUT(<|3>B);
 PUT(<|1>A.<|2>B);
`));

    test("Variable must be partially qualified", () =>
      expectLinks(`
  DCL 1 <|a:A|>,
      2 <|a_b:B|> CHAR(8) VALUE("B");

  DCL 1 A2,
      2 <|a2_c:C|>,
        3 <|a2_c_b:B|> CHAR(8) VALUE("B2");

  PUT (<|a2_c>C.<|a2_c_b>B);
  PUT (<|a>A.<|a_b>B);
`));

    test("Star name in structure should not need to be qualified", () =>
      expectLinks(`
 DCL 1 A,
       2 *,
         3 <|b:B|> CHAR(8) VALUE("B");

 PUT(A.<|b>B);
`));

    /**
     * TODO: Implement star handling in structured names
     */
    test.skip("Star name in structure should be qualifiable", () =>
      expectLinks(`
 DCL 1 A,
        2 *,
          3 B CHAR(8) VALUE("B"),
        2 <|b:B|> CHAR(8) VALUE("B2");

 PUT(A.<|b>B);
`));
  });

  test("fetch linking", () => {
    expectLinks(`
 MAINPR: PROCEDURE OPTIONS(MAIN);
 dcl <|a:A|> entry;
 fetch <|a>A;
 end MAINPR;`);
  });
});
