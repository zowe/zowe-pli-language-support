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
import {
  semanticTokens,
  tokenTypes,
} from "../../src/language-server/semantic-tokens";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "../../src/utils/uri";
import { SemanticTokenDecoder } from "../../src/language-server/semantic-token-decoder";

function formatTestPLI(code: string): string {
  return code.startsWith("\n") ? code.slice(1) : code;
}

function expectSemanticTokens(annotatedCode: string) {
  const { output, ranges } = replaceNamedIndices(formatTestPLI(annotatedCode));

  const textDocument = TextDocument.create(
    URI.file("/test.pli").toString(),
    "pli",
    1,
    output,
  );

  const doc = parse(output, { validate: true });
  const tokens = semanticTokens(textDocument, doc);
  const decodedTokens = SemanticTokenDecoder.decode(
    tokens,
    tokenTypes,
    textDocument,
  );
  const totalRanges = Object.values(ranges).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  expect(decodedTokens).toHaveLength(totalRanges);

  for (const [name, nameRanges] of Object.entries(ranges)) {
    for (const range of nameRanges) {
      const startPosition = textDocument.positionAt(range[0]);
      const endPosition = textDocument.positionAt(range[1]);
      const matchingToken = decodedTokens.find(
        (t) => t.offsetStart === range[0] && t.offsetEnd === range[1],
      );
      expect(
        matchingToken,
        `${name} at ${startPosition.line}:${startPosition.character} - ${endPosition.line}:${endPosition.character} not found`,
      ).toBeDefined();
      expect(
        matchingToken?.semanticTokenType,
        `${name} at ${startPosition.line}:${startPosition.character} - ${endPosition.line}:${endPosition.character} has wrong token type`,
      ).toBe(name);
    }
  }
}

describe("Semantic Tokens", () => {
  test("should highlight procedure declarations", () => {
    const code = `
 <|function:EXAMPLE|>: PROC;
 END <|function:EXAMPLE|>;`;

    expectSemanticTokens(code);
  });

  test("should highlight procedure declarations and calls", () => {
    const code = `
 <|function:EXAMPLE|>: PROC OPTIONS(MAIN);
   CALL <|function:EXAMPLE|>;
 END <|function:EXAMPLE|>;`;

    expectSemanticTokens(code);
  });

  test("should highlight procedure declarations, variables, and assignments", () => {
    const code = `
 <|function:EXAMPLE|>: PROC OPTIONS(MAIN);
   DCL <|variable:X|> FIXED BIN(31);
   <|variable:X|> = 5;
   CALL <|function:EXAMPLE|>;
 END <|function:EXAMPLE|>;`;

    expectSemanticTokens(code);
  });

  test("should highlight nested procedure declarations and variables", () => {
    const code = `
 <|function:OUTER|>: PROC;
   <|function:INNER|>: PROC;
     DCL <|variable:X|> FIXED BIN(31);
     <|variable:X|> = 5;
   END <|function:INNER|>;
 END <|function:OUTER|>;`;

    expectSemanticTokens(code);
  });

  test("should highlight END statements in different contexts", () => {
    const code = `
 <|function:EXAMPLE|>: PROC;
   DO;
     DCL <|variable:X|> FIXED BIN(31);
     <|variable:X|> = 5;
   END;
   BEGIN;
     DCL <|variable:Y|> FIXED BIN(31);
     <|variable:Y|> = 10;
     END;
 END <|function:EXAMPLE|>;`;

    expectSemanticTokens(code);
  });

  test("should highlight function calls", () => {
    const code = `
 <|function:EXAMPLE|>: PROC;
   DCL <|variable:X|> FIXED;
   <|variable:X|> = <|function:EXAMPLE|>(5);
 END <|function:EXAMPLE|>;`;

    expectSemanticTokens(code);
  });
});
