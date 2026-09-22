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
import { TextDocument } from "vscode-languageserver-textdocument";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { defaultTestWorkspace } from "../test-workspace";
import { LspCodes } from "../../src/validation/lsp-codes";
import { fullCode } from "../../src/language-server/types";

// A chain of active variables, each referencing the previous one twice: rescanning the
// final reference expands 2^24 tokens inside a single dispatched instruction, where the
// instruction budget cannot intervene. Only the output-token budget bounds it.
// Column 1 is outside the default margins, so every line starts with a blank.
const lines: string[] = [" %DCL A0 CHAR;", " %A0 = 'X X';", " %ACT A0;"];
for (let i = 1; i <= 24; i++) {
  lines.push(
    ` %DCL A${i} CHAR;`,
    ` %A${i} = 'A${i - 1} A${i - 1}';`,
    ` %ACT A${i};`,
  );
}
lines.push(" A24");
const text = lines.join("\n");

describe("Preprocessor output budget", () => {
  test(
    "caps an exponential rescan expansion and reports it",
    { timeout: 60_000 },
    async () => {
      const lexer = new PliLexer();
      const uri = UriUtils.toUri("/test/output-cap.pli");
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      const unit = await createCompilationUnit(uri, defaultTestWorkspace());
      await lexer.tokenize(unit, document, uri);
      const codes = unit.diagnostics.getAll().map((d) => d.code);
      expect(codes).toContain(fullCode(LspCodes.OutputTruncated));
    },
  );
});
