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
import { Severity } from "../src/language-server/types";
import * as PLICodes from "../src/validation/messages/pli-codes";
import { collectDiagnostics } from "../src/workspace/compilation-unit";
import { assertDiagnostic, assertNoDiagnostics, parse } from "./utils";
import { TestBuilder } from "./test-builder";

// beforeAll(async () => {
//   services = createPliServices(EmptyFileSystem);
//   const doParse = parseHelper<PliProgram>(services.pli);
//   parse = (input: string) => doParse(input, { validation: true });

//   // activate the following if your linking test requires elements from a built-in library, for example
//   await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
// });
// TODO @montymxb Mar. 28th, 2025: Topic of initializing workspace (for built-ins) is still needed

/**
 * Helper to parse w/ validations enabled
 */
function parseWithValidations(text: string) {
  return parse(text, { validate: true });
}

describe("Validating", () => {
  test("check simple program", async () => {
    const doc = parseWithValidations(`
        H: PROC OPTIONS (MAIN);
        DCL ABC BIT(1) INIT(1);
        END H;
        `);
    assertNoDiagnostics(doc);
  });

  test("check empty program", async () => {
    const doc = parseWithValidations(`;`);
    assertDiagnostic(doc, {
      code: PLICodes.Severe.IBM1917I.fullCode,
      severity: Severity.S,
    });
  });

  test("check IBM2462I, unaligned & aligned conflict", async () => {
    const doc = parseWithValidations(`
        H: PROC OPTIONS (MAIN);
        xyz: proc returns ( optional aligned unaligned bit(4) ); // <-- conflicting attributes, second one should be ignored
        return(0);
        end xyz;
        call xyz();
        END H;
            `);
    assertDiagnostic(doc, {
      code: PLICodes.Error.IBM2462I.fullCode,
      severity: Severity.E,
    });
  });

  test("check mismatched end label", async () => {
    const doc = parseWithValidations(`
        MYPROC: PROCEDURE OPTIONS (MAIN);
        DCL TRUE BIT(1) INIT(1);
        DCL FALSE BIT(1) INIT(0);
        DCL OR_VALUE;
        OR_VALUE = TRUE | FALSE;
        DCL NOT_VALUE;
        END MYPROG;
        `);

    const diagnostics = collectDiagnostics(doc);

    // 2 diagnostics, 1 for a bad link, 2nd for the end statement that's mismatched, 3rd for an end label not associated w/ a group
    // the third comes up just by nature of the issue there being no match anyways
    expect(diagnostics.length).toBe(3);

    // verify the first diagnostic is a warning
    expect(diagnostics[0].severity).toBe(Severity.E);

    // verify the 2nd diagnostic is an error w/ the IBM3332I as the code
    expect(diagnostics[1].code).toBe(PLICodes.Warning.IBM3332I.fullCode);
    expect(diagnostics[1].severity).toBe(Severity.W);

    // verify the 3rd diagnostic is an error w/ the IBM1316IE as the code
    expect(diagnostics[2].code).toBe(PLICodes.Error.IBM1316I.fullCode);
    expect(diagnostics[2].severity).toBe(Severity.E);
  });

  test("package end label validates", async () => {
    const doc = parseWithValidations(`
        baseline: package;
        end baseline;`);
    assertNoDiagnostics(doc, {
      ignoreSeverity: [Severity.W], // Ignore unused label warning
    });
  });

  // TODO @montymxb Mar. 28th, 2025: Pending a fix to linking + scoping
  test.fails("validates ordinal reference", async () => {
    const doc = parseWithValidations(`
        define ordinal day (
            Monday,
            Tuesday,
            Wednesday,
            Thursday,
            Friday,
            Saturday,
            Sunday
        ) prec(15);

        // should be able to parse return w/ ordinal correctly
        get_day: proc() returns(ordinal day byvalue);
        return( Friday );
        end get_day;`);
    assertNoDiagnostics(doc);
  });

  // TODO @montymxb Mar. 28th, 2025: Pending re-integration of the built-in library for testing
  test.fails.skip(
    "Reference to alias types __SIGNED_INT & __UNSIGNED_INT",
    async () => {
      const doc = parseWithValidations(`
        mypackage: package;
        DCL x type __SIGNED_INT;
        DCL y type __UNSIGNED_INT;
        end mypackage;
        `);
      assertNoDiagnostics(doc);
    },
  );

  describe("Call validations", () => {
    test("can call function declared by procedure", async () => {
      const doc = parseWithValidations(
        `
           MAINPR: procedure options( main );
           b: proc() returns( OPTIONAL byvalue fixed bin(31) );
             return(32);
           end b;
           call b();
           end MAINPR;
           `,
      );
      assertNoDiagnostics(doc);
    });

    test("can call function declared by entry statement", async () => {
      const doc = parseWithValidations(
        `
            MAINPR: procedure options( main );
            // calling 'a'
            dcl a ext('a') entry( fixed bin(31) byvalue )
              returns( optional bin(31) byvalue );
            call a(5);
            end MAINPR;
             `,
      );
      assertNoDiagnostics(doc);
    });

    test("cannot invoke function from declaration w/out entry (no args)", async () => {
      const doc = parseWithValidations(
        `
            MAINPR: procedure options( main );
            dcl a fixed bin(31); // not callable
            call a;
            end MAINPR;
             `,
      );
      assertDiagnostic(doc, {
        code: PLICodes.Severe.IBM1695I.fullCode,
        severity: Severity.S,
      });
      // expect(doc.diagnostics?.length).toBe(1);
      // expect(document.diagnostics?.[0].code).toBe(Severe.IBM1695I.fullCode);
    });

    test("cannot invoke function from declaration w/out entry (w/ args)", async () => {
      const doc = parseWithValidations(
        `
              MAINPR: procedure options( main );
              // calling 'a'
              dcl a fixed bin(31); // not callable
              call a();
              end MAINPR;
                `,
      );
      assertDiagnostic(doc, {
        code: PLICodes.Severe.IBM1695I.fullCode,
        severity: Severity.S,
      });
      assertDiagnostic(doc, {
        // since we have parens
        code: PLICodes.Error.IBM1231I.fullCode,
        severity: Severity.E,
      });
      const diagnostics = collectDiagnostics(doc);
      expect(diagnostics.length).toBe(2);
    });
  });

  describe("Ordinal validations", async () => {
    test("Signed & unsigned are mutually exclusive", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = parseWithValidations(`
      define ordinal day (
        Monday
      ) prec(15) signed unsigned;`);
      const diagnostics = collectDiagnostics(doc);
      expect(diagnostics.length).not.toBe(0);
    });

    test("Valid to have signed before precision", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = parseWithValidations(`
      define ordinal day (
        Monday
      ) signed prec(15);`);
      const diagnostics = collectDiagnostics(doc);
      expect(diagnostics.length).toBe(0);
    });

    test("Don't allow multiple precisions", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = parseWithValidations(`
      define ordinal day (
        Monday
      ) precision(15) prec(15);`);
      const diagnostics = collectDiagnostics(doc);
      expect(diagnostics.length).not.toBe(0);
    });

    test("Double signed/unsigned is ok (redundant)", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = parseWithValidations(`
      define ordinal D1 (
        Day1
      ) unsigned unsigned;
       
      define ordinal D2 (
        Day2
      ) signed signed;`);
      const diagnostics = collectDiagnostics(doc);
      expect(diagnostics.length).toBe(0);
    });

    test("Factoring of level numbers into declaration lists containing level numbers is invalid", () =>
      TestBuilder.createValidating(
        `
 DCL 1 A,
       2 (B, <|a:3|> C),
       2 (<|b:3|> D),
       2 (3 E, (<|c:4|> F));`,
      )
        .expectExclusiveErrorCodesAt("a", PLICodes.Error.IBM1376I.fullCode)
        .expectExclusiveErrorCodesAt("b", PLICodes.Error.IBM1376I.fullCode)
        .expectExclusiveErrorCodesAt("c", PLICodes.Error.IBM1376I.fullCode));
  });

  describe("*PROCESS Validations", () => {
    test("No options valid", async () => {
      const doc = parseWithValidations(`*PROCESS;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Single option is valid", async () => {
      const doc = parseWithValidations(`*PROCESS NOEXIT;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Warn on mutex opts", async () => {
      const doc = parseWithValidations(`*PROCESS NOAGGREGATE, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message:
          "Mutually exclusive compiler options found for AGGREGATE, only the last one will take effect.",
        severity: Severity.W,
      });
    });

    test("Warn on duplicate opts", async () => {
      const doc = parseWithValidations(`*PROCESS AGGREGATE, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: "Duplicate compiler option AGGREGATE",
        severity: Severity.W,
      });
    });

    test("Warn on unrecognized compiler option", async () => {
      const doc = parseWithValidations(`*PROCESS TYPEFOXOPT;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: PLICodes.Warning.IBM1159I.message("TYPEFOXOPT"),
        severity: Severity.W,
      });
    });

    test("Warn on complex case w/ mutex opt", async () => {
      const doc =
        parseWithValidations(`*PROCESS NODBRMLIB, COMPILE, AGGREGATE, NOCOMPILE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message:
          "Mutually exclusive compiler options found for NOCOMPILE, only the last one will take effect.",
        severity: Severity.W,
      });
    });

    test("Warn on duplicate w/ aliased form", async () => {
      const doc = parseWithValidations(`*PROCESS AG, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: "Duplicate compiler option AGGREGATE",
        severity: Severity.W,
      });
    });

    test("Warn on mutex case w/ aliased form", async () => {
      const doc = parseWithValidations(`*PROCESS NAG, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message:
          "Mutually exclusive compiler options found for AGGREGATE, only the last one will take effect.",
        severity: Severity.W,
      });
    });

    test("Valid on complex case w/ no issues", async () => {
      const doc =
        parseWithValidations(`*PROCESS COMPILE, NODBRMLIB, AGGREGATE, MARGINS(2,72);
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Error on invalid %INCLUDE directive", async () => {
      const doc = parseWithValidations(` %INCLUDE 'nonexistent.pli';
        EP: PROC OPTIONS (MAIN);
        END EP;
      `);
      assertDiagnostic(doc, {
        message: "Cannot resolve include file 'nonexistent.pli'",
        severity: Severity.E,
      });
    });
  });

  //
  //     test('check no errors', async () => {
  //         document = await parseWithValidations(`
  //             person Langium
  //         `);
  //
  //         expect(
  //             // here we first check for validity of the parsed document object by means of the reusable function
  //             //  'checkDocumentValid()' to sort out (critical) typos first,
  //             // and then evaluate the diagnostics by converting them into human readable strings;
  //             // note that 'toHaveLength()' works for arrays and strings alike ;-)
  //             checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
  //         ).toHaveLength(0);
  //     });
  //
  //     test('check capital letter validation', async () => {
  //         document = await parseWithValidations(`
  //             person langium
  //         `);
  //
  //         expect(
  //             checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
  //         ).toEqual(
  //             // 'expect.stringContaining()' makes our test robust against future additions of further validation rules
  //             expect.stringContaining(s`
  //                 [1:19..1:26]: Person name should start with a capital.
  //             `)
  //         );
  //     });
});

// function checkDocumentValid(document: LangiumDocument): string | undefined {
//     return document.parseResult.parserErrors.length && s`
//         Parser errors:
//           ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
//     `
//         || document.parseResult.value === undefined && `ParseResult is 'undefined'.`
//         || !isPliProgram(document.parseResult.value) && `Root AST object is a ${document.parseResult.value.$type}, expected a 'Model'.`
//         || undefined;
// }

// function diagnosticToString(d: Diagnostic) {
//     return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
// }
