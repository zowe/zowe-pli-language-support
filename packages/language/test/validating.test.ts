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


import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import { DiagnosticSeverity } from "vscode-languageserver-types";
import { createPliServices, PliProgram } from "../src";
import { Error, Warning } from "../src/validation/messages/pli-codes";

let services: ReturnType<typeof createPliServices>;
let parse:    ReturnType<typeof parseHelper<PliProgram>>;
let document: LangiumDocument<PliProgram> | undefined;

beforeAll(async () => {
    services = createPliServices(EmptyFileSystem);
    const doParse = parseHelper<PliProgram>(services.pli);
    parse = (input: string) => doParse(input, { validation: true });

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe("Validating", () => {

  test('check mismatched end label', async () => {
    document = await parse(`
  MYPROC: PROCEDURE OPTIONS (MAIN);
  DCL TRUE BIT(1) INIT(1);
  DCL FALSE BIT(1) INIT(0);
  DCL OR_VALUE; 
  OR_VALUE = TRUE | FALSE;
  DCL NOT_VALUE;  
  END MYPROG;
    `);

    // 2 diagnostics, 1 for a bad link, 2nd for the end statement that's mismatched, 3rd for an end label not associated w/ a group
    // the third comes up just by nature of the issue there being no match anyways
    expect(document.diagnostics?.length).toBe(3);

    // verify the first diagnostic is a warning
    expect(document.diagnostics?.[0].severity).toBe(DiagnosticSeverity.Warning);

    // verify the 2nd diagnostic is an error w/ the IBM3332I as the code
    expect(document.diagnostics?.[1].code).toBe(Warning.IBM3332I.fullCode);
    expect(document.diagnostics?.[1].severity).toBe(DiagnosticSeverity.Warning);

    // verify the 3rd diagnostic is an error w/ the IBM1316IE as the code
    expect(document.diagnostics?.[2].code).toBe(Error.IBM1316I.fullCode);
    expect(document.diagnostics?.[2].severity).toBe(DiagnosticSeverity.Error);
  });


  //
  //     test('check no errors', async () => {
  //         document = await parse(`
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
  //         document = await parse(`
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
