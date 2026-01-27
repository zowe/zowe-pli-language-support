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
    expect(result[0].title).toBe('Change "A.B.C"');
    expect(result[0].edit?.changes?.[data.uri]?.[0].newText).toBe("A.B.C");
    expect(result[1].title).toBe('Change "AA.B.C"');
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
    expect(result[0].title).toBe('Change "AA.B.C"');
    expect(result[0].edit?.changes?.[data.uri]?.[0].newText).toBe("AA.B.C");
  });
});
