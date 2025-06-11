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
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "../../src/utils/uri";
import { skippedCodeRanges } from "../../src/language-server/skipped-code";
import { EditorDocuments } from "../../src/language-server/text-documents";

function formatTestPLI(code: string) {
  if (code.startsWith("\n")) {
    code = code.slice(1);
  }

  return code;
}

function expectSkippedCode(annotatedCode: string) {
  const { output, ranges } = replaceIndices({
    text: formatTestPLI(annotatedCode),
  });

  const textDocument = TextDocument.create(
    URI.file("/test.pli").toString(),
    "pli",
    1,
    output,
  );
  EditorDocuments.set(textDocument);
  const unit = parse(output, { validate: true });
  const codeRanges = skippedCodeRanges(unit);

  expect(codeRanges).toHaveLength(ranges.length);
  for (let i = 0; i < ranges.length; i++) {
    const startPosition = textDocument.positionAt(ranges[i][0]);
    const endPosition = textDocument.positionAt(ranges[i][1]);
    expect(codeRanges[i].start).toEqual(startPosition);
    expect(codeRanges[i].end).toEqual(endPosition);
  }
}

describe("Skipped Code", () => {
  test("should highlight skipped code", () => {
    const code = `
 IGNO: PROCEDURE OPTIONS (MAIN);
 %SKIP (2);
<|   dcl A fixed bin(31);
   dcl B fixed bin(31);
|>   dcl WHAT fixed bin(31);  
   WHAT = 123;
 END;`;

    expectSkippedCode(code);
  });

  test("should highlight skipped else branch", () => {
    const code = `
 IGNO: PROCEDURE OPTIONS (MAIN);
   dcl A fixed bin(31);
   dcl B fixed bin(31);
   dcl WHAT fixed bin(31);  
   %DECLARE C fixed;
   %C = 1;   
   %IF %C %THEN %DO;
     WHAT = 123;
   %END;
   %ELSE <|%DO;
     WHAT = 456;
   %END;|>
  END;`;

    expectSkippedCode(code);
  });

  test("should highlight skipped true branch", () => {
    const code = `
 IGNO: PROCEDURE OPTIONS (MAIN);
   dcl A fixed bin(31);
   dcl B fixed bin(31);
   dcl WHAT fixed bin(31);  
   %DECLARE C fixed;
   %C = 0;   
   %IF %C %THEN <|%DO;
     WHAT = 123;
   %END;|>
   %ELSE %DO;
     WHAT = 456;
   %END;
  END;`;

    expectSkippedCode(code);
  });
});
