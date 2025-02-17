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

// TODO @montymxb Jan. 24th, 2025
// - test support for alignment attributes, which are mutually exclusive ALIGNED & UNALIGNED (valid in returns attribute context)
// ex. `xyz: proc returns ( aligned unaligned bit(4) )`

import { describe, test } from "vitest";
// import { beforeAll, describe, expect, test } from "vitest";
// import { EmptyFileSystem, type LangiumDocument } from "langium";
// import { expandToString as s } from "langium/generate";
// import { parseHelper } from "langium/test";
// import type { Diagnostic } from "vscode-languageserver-types";
// import type { Model } from "pl-one-language";
// import { createPl1Services, isModel } from "pl-one-language";
//
// let services: ReturnType<typeof createPl1Services>;
// let parse:    ReturnType<typeof parseHelper<Model>>;
// let document: LangiumDocument<Model> | undefined;
//
// beforeAll(async () => {
//     services = createPl1Services(EmptyFileSystem);
//     const doParse = parseHelper<Model>(services.Pl1);
//     parse = (input: string) => doParse(input, { validation: true });
//
//     // activate the following if your linking test requires elements from a built-in library, for example
//     // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
// });
//
describe("Validating", () => {
  test("empty test", () => {});

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
//
// function checkDocumentValid(document: LangiumDocument): string | undefined {
//     return document.parseResult.parserErrors.length && s`
//         Parser errors:
//           ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
//     `
//         || document.parseResult.value === undefined && `ParseResult is 'undefined'.`
//         || !isModel(document.parseResult.value) && `Root AST object is a ${document.parseResult.value.$type}, expected a 'Model'.`
//         || undefined;
// }
//
// function diagnosticToString(d: Diagnostic) {
//     return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
// }
