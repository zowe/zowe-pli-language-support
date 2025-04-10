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
import { parse, replaceIndices } from "../utils";
import {
  semanticTokens,
  tokenTypes,
} from "../../src/language-server/semantic-tokens";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "../../src/utils/uri";
import { SemanticTokenDecoder } from "../../src/language-server/semantic-token-decoder";
import { SemanticTokenTypes } from "vscode-languageserver-types";

function formatTestPLI(code: string) {
  if (code.startsWith("\n")) {
    code = code.slice(1);
  }
  code = code
    .split("\n")
    .map((line) => " " + line)
    .join("\n");
  return code;
}

function expectSemanticTokens(annotatedCode: string, expectedTypes: string[]) {
  const { output, ranges } = replaceIndices({
    text: formatTestPLI(annotatedCode),
  });

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

  expect(decodedTokens).toHaveLength(ranges.length);
  expect(decodedTokens).toHaveLength(expectedTypes.length);
  for (let i = 0; i < ranges.length; i++) {
    expect(decodedTokens[i].offsetStart).toBe(ranges[i][0]);
    expect(decodedTokens[i].offsetEnd).toBe(ranges[i][1]);
    expect(decodedTokens[i].semanticTokenType).toBe(expectedTypes[i]);
  }
}

describe("Semantic Tokens", () => {
  test("should highlight procedure declarations", () => {
    const code = `
<|EXAMPLE|>: PROC;
END <|EXAMPLE|>;`;

    expectSemanticTokens(code, [
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
    ]);
  });

  test("should highlight procedure declarations and calls", () => {
    const code = `
<|EXAMPLE|>: PROC OPTIONS(MAIN);
  CALL <|EXAMPLE|>;
END <|EXAMPLE|>;`;

    expectSemanticTokens(code, [
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
    ]);
  });

  test("should highlight procedure declarations, variables, and assignments", () => {
    const code = `
<|EXAMPLE|>: PROC OPTIONS(MAIN);
  DCL <|X|> FIXED BIN(31);
  <|X|> = 5;
  CALL <|EXAMPLE|>;
END <|EXAMPLE|>;`;

    expectSemanticTokens(code, [
      SemanticTokenTypes.function,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
    ]);
  });

  test("should highlight nested procedure declarations and variables", () => {
    const code = `
<|OUTER|>: PROC;
  <|INNER|>: PROC;
    DCL <|X|> FIXED BIN(31);
    <|X|> = 5;
  END <|INNER|>;
END <|OUTER|>;`;

    expectSemanticTokens(code, [
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.function,
      SemanticTokenTypes.function,
    ]);
  });

  test("should highlight END statements in different contexts", () => {
    const code = `
<|EXAMPLE|>: PROC;
  DO;
    DCL <|X|> FIXED BIN(31);
    <|X|> = 5;
  END;
  BEGIN;
    DCL <|Y|> FIXED BIN(31);
    <|Y|> = 10;
    END;
END <|EXAMPLE|>;`;

    expectSemanticTokens(code, [
      SemanticTokenTypes.function,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.variable,
      SemanticTokenTypes.function,
    ]);
  });
});
