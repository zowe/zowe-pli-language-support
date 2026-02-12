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
import {
  AmbiguousReferenceData,
  quickFixResolveAmbiguousReference,
} from "../../src/language-server/code-actions/apply-quick-fixes";
import { Diagnostic } from "vscode-languageserver-types";
import { PLICodes } from "../../src/validation/pli-codes";

describe("quickFixResolveAmbiguousReference", () => {
  test("same length of qualified names", async () => {
    const data: AmbiguousReferenceData = {
      symbols: [
        ["A", "B", "C"],
        ["AA", "B", "C"],
      ],
      uri: "file:///path/to/file.pli",
    };
    const diagnostic = {
      data,
      code: PLICodes.Severe.IBM1881I.code,
    } as Diagnostic;
    const result = quickFixResolveAmbiguousReference(diagnostic);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Change to "A.B.C"');
    expect(result[0].edit?.changes?.[data.uri]?.[0].newText).toBe("A.B.C");
    expect(result[1].title).toBe('Change to "AA.B.C"');
    expect(result[1].edit?.changes?.[data.uri]?.[0].newText).toBe("AA.B.C");
  });

  test("different length of qualified names", async () => {
    const data: AmbiguousReferenceData = {
      symbols: [
        ["B", "C"],
        ["AA", "B", "C"],
      ],
      uri: "file:///path/to/file.pli",
    };
    const diagnostic = {
      data,
      code: PLICodes.Severe.IBM1881I.code,
    } as Diagnostic;
    const result = quickFixResolveAmbiguousReference(diagnostic);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Change to "AA.B.C"');
    expect(result[0].edit?.changes?.[data.uri]?.[0].newText).toBe("AA.B.C");
  });

  test("same alternatives", async () => {
    const data: AmbiguousReferenceData = {
      symbols: [
        ["B", "C"],
        ["B", "C"],
      ],
      uri: "file:///path/to/file.pli",
    };
    const diagnostic = {
      data,
      code: PLICodes.Severe.IBM1881I.code,
    } as Diagnostic;
    const result = quickFixResolveAmbiguousReference(diagnostic);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});
