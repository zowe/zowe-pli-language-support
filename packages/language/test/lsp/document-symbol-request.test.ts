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
import { parse, replaceNamedIndices } from "../utils";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "../../src/utils/uri";
import { documentSymbolRequest } from "../../src/language-server/document-symbol-request";
import { DocumentSymbol, SymbolKind } from "vscode-languageserver-types";
import { TextDocuments } from "../../src/language-server/text-documents";

type SymbolWithLevel = {
  symbol: DocumentSymbol;
  level: number;
};

const formatTestPLI = (code: string): string =>
  code.startsWith("\n") ? code.slice(1) : code;

const documentSymbolKindString = (symbolKind: SymbolKind): string =>
  Object.keys(SymbolKind).find(
    (key) => SymbolKind[key as keyof typeof SymbolKind] === symbolKind,
  ) ?? "";

function expectDocumentSymbols(annotatedCode: string): void {
  const { output, ranges } = replaceNamedIndices(formatTestPLI(annotatedCode));
  const textDocument = TextDocument.create(
    URI.file("/test.pli").toString(),
    "pli",
    1,
    output,
  );

  TextDocuments.set(textDocument);
  const unit = parse(output, { validate: true });
  const documentSymbols = documentSymbolRequest(URI.file("/test.pli"), unit);

  const totalRanges = Object.values(ranges).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  const flatSymbols = documentSymbols.reduce<SymbolWithLevel[]>(
    (acc, symbol) => {
      const flatten = (s: DocumentSymbol, level: number) => {
        acc.push({ symbol: s, level });
        s.children?.forEach((child) => flatten(child, level + 1));
      };
      flatten(symbol, 0);
      return acc;
    },
    [],
  );

  expect(flatSymbols).toHaveLength(totalRanges);

  for (const [name, nameRanges] of Object.entries(ranges)) {
    const [symbolKind, hierarchyLevel] = name.split("_");
    for (const range of nameRanges) {
      const startPosition = textDocument.positionAt(range[0]);
      const endPosition = textDocument.positionAt(range[1]);
      const matchingSymbol = flatSymbols.find(
        (s) =>
          documentSymbolKindString(s.symbol.kind) === symbolKind &&
          s.level === Number(hierarchyLevel) &&
          s.symbol.selectionRange.start.line === startPosition.line &&
          s.symbol.selectionRange.start.character === startPosition.character &&
          s.symbol.selectionRange.end.line === endPosition.line &&
          s.symbol.selectionRange.end.character === endPosition.character,
      );
      expect(
        matchingSymbol,
        `${name} at ${startPosition.line}:${startPosition.character} - ${endPosition.line}:${endPosition.character} not found`,
      ).toBeDefined();
    }
  }
}

describe("Document Symbol Request", () => {
  test("should retrieve symbols for basic function and variable declarations", () => {
    const code = `
 <|Function_0:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl <|Variable_1:A|> fixed bin(31);
   dcl <|Variable_1:WHAT|> fixed bin(31);  
   WHAT = 123;
 END;`;

    expectDocumentSymbols(code);
  });

  test("should retrieve symbols for function, variable, and constant declarations", () => {
    const code = `
 <|Function_0:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl <|Variable_1:A|> fixed bin(31);
   dcl <|Constant_1:PI|> constant(3.14159);
 END;`;

    expectDocumentSymbols(code);
  });

  test("should retrieve symbols for basic struct declarations", () => {
    const code = `
 <|Function_0:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl 1 <|Struct_1:myStruct|>,
         2 <|Struct_2:myField1|> fixed bin(31),
           3 <|Variable_3:myField2|> char(10);
 END;`;

    expectDocumentSymbols(code);
  });

  test("should retrieve symbols for complex nested struct declarations with multiple levels", () => {
    const code = `
 <|Function_0:IGNO|>: PROCEDURE OPTIONS (MAIN);
   dcl <|Variable_1:A|> fixed bin(31);
   dcl 1 <|Struct_1:myStruct|>,
         2 <|Struct_2:myField1|> fixed bin(31),
           3 <|Variable_3:myField2|> char(10),
           3 <|Variable_3:myField3|> char(10),
         2 <|Struct_2:myField3|> char(10),
           3 <|Constant_3:PI|> constant(3.1415),
         2 <|Struct_2:myField4|> char(10),
           11 (<|Variable_3:XX|>, <|Variable_3:ZZ|>) char(10),
         2 <|Variable_2:myField5|> char(10);
 END;`;

    expectDocumentSymbols(code);
  });

  test("should retrieve symbols for procedure, labels, variables, and constants", () => {
    const code = `
 <|Function_0:IGNO|>: PROCEDURE OPTIONS (MAIN);
   <|Key_1:L1004|>: dcl <|Variable_1:A|> fixed bin(31);
   <|Key_1:L1005|>: dcl <|Constant_1:PI|> constant(3.14159);
 END;`;

    expectDocumentSymbols(code);
  });
});

// Todo: Add test for generated declarations
// %DCL X FIXED;
// %X = 1;
// %DO
//   %WHILE(%X <= 3);
//     DCL Variable%X FIXED;
//     %X = %X + 1;
// %END;
// Variable1 = 1;
// Variable2 = 2;
// Variable3 = 3;
