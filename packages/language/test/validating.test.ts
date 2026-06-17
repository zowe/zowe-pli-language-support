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
import { fullCode, Severity } from "../src/language-server/types";
import * as PLICodes from "../src/validation/pli-codes";
import { assertDiagnostic, assertNoDiagnostics, parse } from "./utils";
import { TestBuilder } from "./test-builder";
import { deserializeProcessGroup } from "../src/workspace/plugin-configuration-provider";
import { LspCodes } from "../src/validation/lsp-codes";
import { UriUtils } from "../src/utils/uri";
import { makeProgramConfig } from "./config-fixtures";
import { createTestWorkspace, setDefaultTestWorkspace } from "./test-workspace";
import { EmptyFileSystemProvider } from "../src/workspace/file-system-provider";

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
    const doc = await parseWithValidations(`
        H: PROC OPTIONS (MAIN);
        DCL ABC BIT(1) INIT(1);
        END H;
        `);
    assertNoDiagnostics(doc);
  });

  test.skip("check empty program", async () => {
    const doc = await parseWithValidations(`;`);
    assertDiagnostic(doc, {
      code: fullCode(PLICodes.Severe.IBM1917I),
      severity: Severity.S,
    });
  });

  test.skip("check IBM2462I, unaligned & aligned conflict", async () => {
    const doc = await parseWithValidations(`
        H: PROC OPTIONS (MAIN);
        xyz: proc returns ( optional aligned unaligned bit(4) ); // <-- conflicting attributes, second one should be ignored
        return(0);
        end xyz;
        call xyz();
        END H;
            `);
    assertDiagnostic(doc, {
      code: fullCode(PLICodes.Error.IBM2462I),
      severity: Severity.E,
    });
  });

  test.skip("check mismatched end label", async () => {
    const doc = await parseWithValidations(`
        MYPROC: PROCEDURE OPTIONS (MAIN);
        DCL TRUE BIT(1) INIT(1);
        DCL FALSE BIT(1) INIT(0);
        DCL OR_VALUE;
        OR_VALUE = TRUE | FALSE;
        DCL NOT_VALUE;
        END MYPROG;
        `);

    const diagnostics = doc.diagnostics.getAll();

    // 2 diagnostics, 1 for a bad link, 2nd for the end statement that's mismatched, 3rd for an end label not associated w/ a group
    // the third comes up just by nature of the issue there being no match anyways
    expect(diagnostics.length).toBe(3);

    // verify the first diagnostic is a warning
    expect(diagnostics[0].severity).toBe(Severity.E);

    // verify the 2nd diagnostic is an error w/ the IBM3332I as the code
    expect(diagnostics[1].code).toBe(fullCode(PLICodes.Warning.IBM3332I));
    expect(diagnostics[1].severity).toBe(Severity.W);

    // verify the 3rd diagnostic is an error w/ the IBM1316IE as the code
    expect(diagnostics[2].code).toBe(fullCode(PLICodes.Error.IBM1316I));
    expect(diagnostics[2].severity).toBe(Severity.E);
  });

  test("package end label validates", async () => {
    const doc = await parseWithValidations(`
        baseline: package;
        end baseline;`);
    assertNoDiagnostics(doc, {
      ignoreSeverity: [Severity.W], // Ignore unused label warning
    });
  });

  test("validates ordinal reference", async () => {
    const doc = await parseWithValidations(`
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

  test("Reference to alias types __SIGNED_INT & __UNSIGNED_INT", async () => {
    const doc = await parseWithValidations(`
      mypackage: package;
      DCL x type __SIGNED_INT;
      DCL y type __UNSIGNED_INT;
      end mypackage;
      `);
    assertNoDiagnostics(doc);
  });

  test("__SIGNED_INT and __UNSIGNED_INT with LP(32)", async () => {
    const doc = await parseWithValidations(`*PROCESS LP(32);
        mypackage: package;
        DCL x type __SIGNED_INT;
        DCL y type __UNSIGNED_INT;
        end mypackage;
        `);
    assertNoDiagnostics(doc);
  });

  test("__SIGNED_INT and __UNSIGNED_INT with LP(64)", async () => {
    const doc = await parseWithValidations(`*PROCESS LP(64);
        mypackage: package;
        DCL x type __SIGNED_INT;
        DCL y type __UNSIGNED_INT;
        end mypackage;
        `);
    assertNoDiagnostics(doc);
  });

  describe("Call validations", () => {
    test("can call function declared by procedure", async () => {
      const doc = await parseWithValidations(
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
      const doc = await parseWithValidations(
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

    test.skip("cannot invoke function from declaration w/out entry (no args)", async () => {
      const doc = await parseWithValidations(
        `
            MAINPR: procedure options( main );
            dcl a fixed bin(31); // not callable
            call a;
            end MAINPR;
             `,
      );
      assertDiagnostic(doc, {
        code: fullCode(PLICodes.Severe.IBM1695I),
        severity: Severity.S,
      });
      // expect(doc.diagnostics?.length).toBe(1);
      // expect(document.diagnostics?.[0].code).toBe(Severe.IBM1695I.fullCode);
    });

    test.skip("cannot invoke function from declaration w/out entry (w/ args)", async () => {
      const doc = await parseWithValidations(
        `
              MAINPR: procedure options( main );
              // calling 'a'
              dcl a fixed bin(31); // not callable
              call a();
              end MAINPR;
                `,
      );
      assertDiagnostic(doc, {
        code: fullCode(PLICodes.Severe.IBM1695I),
        severity: Severity.S,
      });
      assertDiagnostic(doc, {
        // since we have parens
        code: fullCode(PLICodes.Error.IBM1231I),
        severity: Severity.E,
      });
      const diagnostics = doc.diagnostics.getAll();
      expect(diagnostics.length).toBe(2);
    });
  });

  describe("Ordinal validations", async () => {
    test.skip("Signed & unsigned are mutually exclusive", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = await parseWithValidations(`
      define ordinal day (
        Monday
      ) prec(15) signed unsigned;`);
      const diagnostics = doc.diagnostics.getAll();
      expect(diagnostics.length).not.toBe(0);
    });

    test("Valid to have signed before precision", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = await parseWithValidations(`
      define ordinal day (
        Monday
      ) signed prec(15);`);
      const diagnostics = doc.diagnostics.getAll();
      expect(diagnostics.length).toBe(0);
    });

    test.skip("Don't allow multiple precisions", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = await parseWithValidations(`
      define ordinal day (
        Monday
      ) precision(15) prec(15);`);
      const diagnostics = doc.diagnostics.getAll();
      expect(diagnostics.length).not.toBe(0);
    });

    test("Double signed/unsigned is ok (redundant)", async () => {
      // ensure that only one set of signed/unsigned & precision is specified
      const doc = await parseWithValidations(`
      define ordinal D1 (
        Day1
      ) unsigned unsigned;
       
      define ordinal D2 (
        Day2
      ) signed signed;`);
      const diagnostics = doc.diagnostics.getAll();
      expect(diagnostics.length).toBe(0);
    });

    test("Factoring of level numbers into declaration lists containing level numbers is invalid", async () =>
      (
        await TestBuilder.createValidating(
          `
 DCL 1 A,
       2 (B, <|a:3|> C),
       2 (<|b:3|> D),
       2 (3 E, (<|c:4|> F));`,
        )
      )
        .expectExclusiveErrorCodesAt("a", fullCode(PLICodes.Error.IBM1376I))
        .expectExclusiveErrorCodesAt("b", fullCode(PLICodes.Error.IBM1376I))
        .expectExclusiveErrorCodesAt("c", fullCode(PLICodes.Error.IBM1376I)));
  });

  describe("*PROCESS Validations", () => {
    test("No options valid", async () => {
      const doc = await parseWithValidations(`*PROCESS;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Single option is valid", async () => {
      const doc = await parseWithValidations(`*PROCESS NOEXIT;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Warn on mutex opts", async () => {
      const doc = await parseWithValidations(`*PROCESS NOAGGREGATE, AGGREGATE;
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
      const doc = await parseWithValidations(`*PROCESS AGGREGATE, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: "Duplicate compiler option found for AGGREGATE.",
        severity: Severity.W,
      });
    });

    test("Warn on unrecognized compiler option", async () => {
      const doc = await parseWithValidations(`*PROCESS TYPEFOXOPT;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: PLICodes.Warning.IBM1159I.message("TYPEFOXOPT"),
        severity: Severity.E,
      });
    });

    test("Warn on complex case w/ mutex opt", async () => {
      const doc =
        await parseWithValidations(`*PROCESS NODBRMLIB, COMPILE, AGGREGATE, NOCOMPILE;
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
      const doc = await parseWithValidations(`*PROCESS AG, AGGREGATE;
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertDiagnostic(doc, {
        message: "Duplicate compiler option found for AGGREGATE.",
        severity: Severity.W,
      });
    });

    test("Warn on mutex case w/ aliased form", async () => {
      const doc = await parseWithValidations(`*PROCESS NAG, AGGREGATE;
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
        await parseWithValidations(`*PROCESS COMPILE, NODBRMLIB, AGGREGATE, MARGINS(2,72);
        EP: PROC OPTIONS (MAIN);
        END EP;
        `);
      assertNoDiagnostics(doc);
    });

    test("Error on invalid %INCLUDE directive (file doesn't exist)", async () => {
      const workspace = createTestWorkspace(EmptyFileSystemProvider);
      setDefaultTestWorkspace(workspace);
      const pluginConfig = workspace.config;
      await pluginConfig.init(UriUtils.toUri("/"));
      const processGroup = deserializeProcessGroup({
        name: "default",
      });
      await pluginConfig.setProcessGroupConfigs([processGroup]);
      pluginConfig.setProgramConfigs(UriUtils.toUri("/"), [
        makeProgramConfig({ program: "**/*.pli", pgroup: "default" }),
      ]);

      const doc = await parseWithValidations(` %INCLUDE 'nonexistent.pli';
        EP: PROC OPTIONS (MAIN);
        END EP;
      `);
      assertDiagnostic(doc, {
        message: "The INCLUDE file for nonexistent.pli could not be found.",
        severity: Severity.S,
      });
      setDefaultTestWorkspace(undefined);
    });

    test("Error on invalid %INCLUDE directive (config doesn't exist)", async () => {
      const doc = await parseWithValidations(` %INCLUDE 'nonexistent.pli';
        EP: PROC OPTIONS (MAIN);
        END EP;
      `);
      assertDiagnostic(doc, {
        message: LspCodes.IncludeResolution.MissingConfiguration.message,
        severity: LspCodes.IncludeResolution.MissingConfiguration.severity,
      });
    });
  });
});
