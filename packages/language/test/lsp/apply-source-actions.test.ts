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

import { test, expect, describe } from "vitest";
import { Diagnostic } from "vscode-languageserver-types";
import * as applySourceActions from "../../src/language-server/code-actions/apply-source-actions";

describe("sourceActionUppercaseAllText", () => {
  test("should create a source action for multiple case diagnostics", () => {
    const diagnostics: Diagnostic[] = [
      {
        code: "LSPUC001W",
        message: "Input text must be uppercase.",
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 5 },
        },
        data: {
          uri: "file:///test.pli",
          text: "hello",
        },
      },
      {
        code: "LSPUC001W",
        message: "Input text must be uppercase.",
        range: {
          start: { line: 0, character: 6 },
          end: { line: 0, character: 11 },
        },
        data: {
          uri: "file:///test.pli",
          text: "world",
        },
      },
    ];

    const result = applySourceActions.sourceActionUppercaseAllText(diagnostics);

    expect(result).toBeDefined();
    expect(result.title).toBe("Convert all to uppercase (2 instances)");
    expect(result.kind).toBe("source.fixAll");
    expect(result.diagnostics).toEqual(diagnostics);
    expect(result.edit).toBeDefined();
    expect(result.edit!.changes).toBeDefined();
    expect(result.edit!.changes!["file:///test.pli"]).toHaveLength(2);
    expect(result.edit!.changes!["file:///test.pli"][0].newText).toBe("HELLO");
    expect(result.edit!.changes!["file:///test.pli"][1].newText).toBe("WORLD");
  });

  test("should handle multiple files", () => {
    const diagnostics: Diagnostic[] = [
      {
        code: "LSPUC001W",
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 5 },
        },
        data: { uri: "file:///test1.pli", text: "hello" },
      } as Diagnostic,
      {
        code: "LSPUC001W",
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 5 },
        },
        data: { uri: "file:///test2.pli", text: "world" },
      } as Diagnostic,
    ];

    const result = applySourceActions.sourceActionUppercaseAllText(diagnostics);

    expect(result).toBeDefined();
    expect(result.edit!.changes!["file:///test1.pli"]).toHaveLength(1);
    expect(result.edit!.changes!["file:///test1.pli"][0].newText).toBe("HELLO");
    expect(result.edit!.changes!["file:///test2.pli"]).toHaveLength(1);
    expect(result.edit!.changes!["file:///test2.pli"][0].newText).toBe("WORLD");
  });
});
