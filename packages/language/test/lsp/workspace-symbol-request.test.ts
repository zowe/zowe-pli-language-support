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
import { UriUtils } from "../../src/utils/uri";
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import * as lifecycle from "../../src/workspace/lifecycle";
import { workspaceSymbolRequest } from "../../src/language-server/workspace-symbol-request";
import { EditorDocuments } from "../../src/language-server/text-documents";
import { CancellationToken } from "vscode-languageserver";
import { defaultTestWorkspace } from "../test-workspace";
import { TestGlobalConfigLoader, VirtualFileSystemProvider } from "../../src";
import { LongRunningOperationImpl } from "../../src/utils/promises";
import { newLibraryCaches } from "../../src/config/lib-expander";

const formatTestPLI = (code: string): string =>
  code.startsWith("\n") ? code.slice(1) : code;

async function expectWorkspaceSymbols(annotatedCode: string[]): Promise<void> {
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
        allRanges.push({ fileIndex, name, range: [range.start, range.end] });
      }
    }
  }

  const textDocuments = outputs.map((output, i) =>
    TextDocument.create(
      UriUtils.toUri(`/test${i}.pli`).toString(),
      "pli",
      1,
      output,
    ),
  );

  const fs = new VirtualFileSystemProvider();
  const handler = new CompilationUnitHandler(
    fs,
    new TestGlobalConfigLoader({}),
    newLibraryCaches(),
    LongRunningOperationImpl.Dummy,
  );
  const workspace = defaultTestWorkspace();
  handler.addWorkspaceFolder("file:///", workspace);
  textDocuments.forEach((doc) => EditorDocuments.set(doc));
  await Promise.all(
    textDocuments.map(async (doc, i) => {
      const unit = await workspace.createAndStoreCompilationUnit(
        UriUtils.toUri(`/test${i}.pli`),
      );

      if (!unit) {
        // standalone library files do not synthesize new compilation units
        return unit;
      }

      await lifecycle.lifecycle(unit, doc, CancellationToken.None);
      return unit;
    }),
  );

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
    const workspaceSymbols = await workspaceSymbolRequest(
      name,
      handler.getAllCompilationUnits(),
    );
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
  test("should retrieve symbols for basic function and variable declarations", async () => {
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

    await expectWorkspaceSymbols([code0, code1]);
  });
});
