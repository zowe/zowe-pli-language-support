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

import { describe, test, expect } from "vitest";
import { replaceNamedIndices } from "../utils";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "../../src/utils/uri";
import { workspaceSymbolRequest } from "../../src/language-server/workspace-symbol-request";
import { TextDocuments } from "../../src/language-server/text-documents";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import * as lifecycle from "../../src/workspace/lifecycle";

const formatTestPLI = (code: string): string =>
  code.startsWith("\n") ? code.slice(1) : code;

function expectWorkspaceSymbols(annotatedCode: string[]): void {
  const outputs: string[] = [];
  const allRanges: {
    fileIndex: number;
    name: string;
    range: [number, number];
  }[] = [];

  for (const [fileIndex, code] of annotatedCode.entries()) {
    const { output, ranges } = replaceNamedIndices(formatTestPLI(code));
    outputs.push(output);
    for (const [name, rangeList] of Object.entries(ranges)) {
      for (const range of rangeList) {
        allRanges.push({ fileIndex, name, range });
      }
    }
  }

  const textDocuments = outputs.map((output, i) =>
    TextDocument.create(URI.file(`/test${i}.pli`).toString(), "pli", 1, output),
  );

  textDocuments.forEach((doc) => TextDocuments.set(doc));
  const units = outputs.map((output, i) => {
    const unit = createCompilationUnit(URI.file(`/test${i}.pli`));
    lifecycle.lifecycle(unit, output);
    return unit;
  });

  const rangesWithSameName: Record<
    string,
    Record<number, [number, number][]>
  > = {};
  for (const { fileIndex, name, range } of allRanges) {
    if (!rangesWithSameName[name]) {
      rangesWithSameName[name] = {};
    }
    if (!rangesWithSameName[name][fileIndex]) {
      rangesWithSameName[name][fileIndex] = [];
    }
    rangesWithSameName[name][fileIndex].push(range);
  }

  for (const name of Object.keys(rangesWithSameName)) {
    const workspaceSymbols = workspaceSymbolRequest(units, name);
    const totalRangesForName = Object.values(rangesWithSameName[name]).reduce(
      (acc, fileRanges) => acc + fileRanges.length,
      0,
    );
    expect(
      workspaceSymbols.length,
      `The query for ${name} did not return the correct number of symbols`,
    ).toBe(totalRangesForName);

    // Todo: Check end position when named indices support nesting.
    for (const symbol of workspaceSymbols) {
      const fileIndex = Number(symbol.location.uri.split(".")[0].slice(-1));
      const symbolRanges = rangesWithSameName[name][fileIndex].find((r) => {
        const startPosition = textDocuments[fileIndex].positionAt(r[0]);
        return (
          startPosition.line === symbol.location.range.start.line &&
          startPosition.character === symbol.location.range.start.character
        );
      });
      expect(
        symbolRanges,
        `The symbol ${symbol.name} with the correct range was not found`,
      ).toBeDefined();
    }
  }
}

describe("Workspace Symbol Request", () => {
  test("should retrieve symbols for basic function and variable declarations", () => {
    const code0 = `
 <|IG:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl <|A:A|> fixed bin(31);
   dcl <|A:WHAT|> fixed bin(31);  
   WHAT = 123;
 END;`;

    const code1 = `
 <|IG:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl <|A:A|> fixed bin(31);
   dcl PI constant(3.14159);
 END;`;

    expectWorkspaceSymbols([code0, code1]);
  });
});
