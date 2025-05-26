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

import { describe, expect, test } from "vitest";
import {
  expectLinks as expectLinksRoot,
  parseAndLink,
  TestBuilder,
} from "./utils";
import * as PLICodes from "../src/validation/messages/pli-codes";

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

  test("Must link to procedure label before declaration", () =>
    expectLinks(`
 CALL <|1>OUTER;

 <|1:OUTER|>: PROCEDURE;
   PUT("INSIDE");
 END <|1>OUTER;   

 CALL <|1>OUTER;`));

  test("Must handle use before declaration", () =>
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
 PUT(<|1>A); // -> "A"`));

  test("Must handle use before declaration", () =>
    expectLinks(`
 PUT(<|1>A);
 DCL <|1:A|> CHAR(8) INIT("A");
 PUT(<|1>A);`));

  test("Must handle scoping in prodecures", () =>
    expectLinks(`
 DCL <|1:ABC|>;
 CALL <|1>ABC;

 OUTER: PROCEDURE;
  DCL <|2:ABC|>;
  CALL <|2>ABC;
 END OUTER;

 DCL ABC;
 CALL <|1>ABC;`));

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

  test("DO WHILE does not create a new scope", () =>
    expectLinks(`
 PUT(<|a>A);
 DO WHILE (<|a>A < 5);
  PUT(<|a>A);
  DCL <|a:A|> BIN FIXED(15) INIT(0);
  <|proc:MYPROC|>: PROCEDURE;
  END <|proc>MYPROC;
 END;
 PUT(<|a>A);
 CALL <|proc>MYPROC;`));

  test("DO TYPE 3 links to proper var", () =>
    expectLinks(`
      DCL <|I:I> FIXED;
      DO <|I>I = 0 TO 10;
        PUT(<|I>I);
      END;`));

  describe("Qualified names", () => {
    test("Must work in structured declaration", () =>
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

    test("Must infer partially qualified names", () =>
      expectLinks(`
 DCL 1 A,
        2 <|b1:B|>,
          3 K, // Should be skipped in qualification
            4 <|c:C|> CHAR(8) VALUE("C");
 DCL 1 A2,
        2 <|b2:B|>,
          3 K, // Should be skipped in qualification
            4 <|d:D|> CHAR(8) VALUE("D");
 PUT (<|b1>B.<|c>C);
 PUT (<|b2>B.<|d>D);`));

    test("Factorized names can be used as variables", () =>
      expectLinks(`
        DCL (<|1:A|>, <|2:B|>) CHAR(8);
        PUT(<|1>A);
        PUT(<|2>B);`));

    test("Factorized names in structures are correctly unrolled", () =>
      expectLinks(`
        DCL 1 A, 2 (B, C, <|1:D|>), 3 <|2:E|>;
        PUT(A.<|1>D.<|2>E);
        PUT(<|1>D.<|2>E);`));

    test("Factorized names in structures are correctly unrolled with level embedded", () =>
      expectLinks(`
         DCL 1 A, (2 <|1:B|>);
         PUT(A.<|1>B);`));

    test("Factorized names in structures do only appear on the last symbol", () => {
      const doc = parseAndLink(`
        DCL 1 A, 2 (B, C, D), 3 E;
        PUT(A.B.E);
        PUT(A.C.E);
        PUT(A.D.E);
      `);
      const linkingIssues = doc.diagnostics.linking;
      const eLinkIssues = linkingIssues.filter((e) =>
        e.message.includes("'E'"),
      );
      // Both A.B.E and A.C.E are invalid links, while A.D.E is valid
      expect(eLinkIssues).toHaveLength(2);
    });
  });

  describe("Implicit qualification", () => {
    test("Must qualify implicitly in structure", () =>
      expectLinks(`
 DCL 1 <|1:A|>,
     2 <|2:B|> CHAR(8) VALUE("B");
 PUT(<|2>B);
 PUT(<|1>A.<|2>B);`));

    test("Declaration must override implicit qualification", () =>
      expectLinks(`
 DCL 1 <|1:A|>,
     2 <|2:B|> CHAR(8) VALUE("B");
 DCL <|3:B|> CHAR(8) VALUE("B2");
 PUT(<|3>B);
 PUT(<|1>A.<|2>B);`));

    test("Variable must be partially qualified", () =>
      expectLinks(`
  DCL 1 <|a:A|>,
      2 <|a_b:B|> CHAR(8) VALUE("B");
  DCL 1 A2,
      2 <|a2_c:C|>,
        3 <|a2_c_b:B|> CHAR(8) VALUE("B2");
  PUT (<|a2_c>C.<|a2_c_b>B);
  PUT (<|a>A.<|a_b>B);`));

    test("Full qualification should take precedence over partial qualification", () =>
      expectLinks(`
 DCL 1 A,
        2 B,
          3 C,
        2 <|1:C|>;
 PUT(A.<|1>C);`));

    test("Star name in structure should result in partial qualification", () =>
      expectLinks(`
 DCL 1 A,
       2 *,
         3 <|b:B|> CHAR(8) VALUE("B");
 PUT(A.<|b>B);`));

    test("Fully qualified name precedes star name", () =>
      expectLinks(`
 DCL 1 A,
        2 *,
          3 B CHAR(8) VALUE("B"),
        2 <|b:B|> CHAR(8) VALUE("B2");
 PUT(A.<|b>B);`));

    test("Must work before declaration", () =>
      expectLinks(`
 PUT(<|a>A);
 <|a>A = "A2";
 DCL <|a:A|> CHAR(8) INIT("A");
 PUT(<|a>A);`));

    test("Must work across procedure boundaries", () =>
      expectLinks(`
 PUT(<|a>A);

 LABL: PROCEDURE;
   PUT(<|a>A);
 END LABL;

 PUT(<|a>A);
 CALL LABL;

 DCL <|a:A|> CHAR(8) INIT("A");`));
  });

  describe("Preprocessor", () => {
    /**
     * This test intentionally fails in order to test that a native
     * PL/I variable does not link to a preprocessor variable.
     */
    test.fails("Must not link between PL/I and preprocessor variables", () =>
      expectLinks(`
 %DECLARE <|1:PAYROLL|> CHARACTER;
 %<|2:PAYROLL|> = 'PAY_ROLL';
 DCL PAYROLL CHAR(8) VALUE("PAYROLL");
 %DEACTIVATE <|3:PAYROLL|>;
 PUT(<|1><|2><|3>PAYROLL);`),
    );

    test("Must link correctly when collision with preprocessor variables", () =>
      expectLinks(`
 %DECLARE ABC CHARACTER;
 %ABC = 'PAY_ROLL';
 %DEACTIVATE ABC;
 DCL <|1:ABC|> CHAR(8) VALUE("PAYROLL");
 PUT(<|1>ABC);`));
  });

  describe("Faulty cases", () => {
    describe("Redeclarations", () => {
      test("Redeclaration must fail", () =>
        new TestBuilder(`
 DCL A CHAR(8) INIT("A");
 DCL <|1:A|> CHAR(8) INIT("A2");
 `).expectExclusiveErrorCodesAt("1", PLICodes.Error.IBM1306I.fullCode));

      /**
       * We don't have levels here, so it acts like sequential declarations,
       * unlike nested sublevels which have another error.
       */
      test("Redeclaration within the same block must fail", () =>
        new TestBuilder(`
 DCL A CHAR(8) INIT("A"), <|1:A|> CHAR(8) INIT("B");
 `).expectExclusiveErrorCodesAt("1", PLICodes.Error.IBM1306I.fullCode));

      test("Redeclaration within nested sublevels must fail", () =>
        new TestBuilder(`
 DCL 1 A,
       2 B,
         3 C CHAR(8) VALUE("C"),
       2 <|1:B|>,
         3 D CHAR(8) VALUE("D");
 `).expectExclusiveErrorCodesAt("1", PLICodes.Error.IBM1308I.fullCode));

      test("Redeclaration of label must fail", () =>
        new TestBuilder(`
 OUTER: PROCEDURE;
 END OUTER;
 <|1:OUTER|>: PROCEDURE;
 END OUTER;
 CALL OUTER;
 `).expectExclusiveErrorCodesAt("1", PLICodes.Severe.IBM1916I.fullCode));

      test("Repeated declaration of label is invalid (procedure label first)", () =>
        new TestBuilder(`
 A: PROCEDURE;
 END A;
 DCL <|1:A|> CHAR(8) INIT("A");
 `).expectExclusiveErrorCodesAt("1", PLICodes.Error.IBM1306I.fullCode));

      test("Repeated declaration of label is invalid (variable label first)", () =>
        new TestBuilder(`
 DCL <|1:A|> CHAR(8) INIT("A");
 A: PROCEDURE;
 END A;
 `).expectExclusiveErrorCodesAt("1", PLICodes.Error.IBM1306I.fullCode));

      /**
       * @WILLFIX @didrikmunther: currently, we don't have a way to know
       * if a label is a statement label or a procedure label.
       */
      test.skip("Repeated statement label must fail", () => {
        new TestBuilder(`
 GO TO A;
 <|1:A|>:
 A:
 `).expectExclusiveErrorCodesAt("1", PLICodes.Severe.IBM1911I.fullCode);
      });
    });

    test("Unused label should warn", () => {
      new TestBuilder(`
 <|1:OUTER|>: PROCEDURE;
 END OUTER;
 `).expectExclusiveErrorCodesAt("1", PLICodes.Warning.IBM1213I.fullCode);
    });

    test("Ambiguous reference must fail", () => {
      new TestBuilder(`
 DCL 1 A1,
     2 B CHAR(8) VALUE("B1");
 DCL 1 A2,
     2 B CHAR(8) VALUE("B2");
 PUT(<|1:B|>);
 `).expectExclusiveErrorCodesAt("1", PLICodes.Severe.IBM1881I.fullCode);
    });

    test("Structure level greater than 255 is invalid", () =>
      new TestBuilder(`
 DCL 1 A,
       <|a:256|> B;
 `).expectExclusiveErrorCodesAt("a", PLICodes.Error.IBM1363I.fullCode));
  });

  test("fetch linking", () =>
    expectLinks(`
 MAINPR: PROCEDURE OPTIONS(MAIN);
 dcl <|a:A|> entry;
 fetch <|a>A;
 end MAINPR;`));
});
