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

const loop = [" %DO I = 1 TO 100000;", "   %X = X + 1;", " %END;"].join("\n");
const header = [" %DCL I FIXED;", " %DCL X FIXED;", " %X = 0;"].join("\n");

async function diagnosticCodes(text: string): Promise<(string | undefined)[]> {
  const lexer = new PliLexer();
  const uri = UriUtils.toUri("/test/budget-diagnostic.pli");
  const document = TextDocument.create(uri.toString(), "pli", 0, text);
  const unit = await createCompilationUnit(uri, defaultTestWorkspace());
  await lexer.tokenize(unit, document, uri);
  return unit.diagnostics.getAll().map((d) => d.code);
}

describe("Preprocessor instruction budget diagnostic", () => {
  test("reports budget exhaustion as an editor-visible diagnostic", async () => {
    const codes = await diagnosticCodes(`${header}\n${loop}`);
    expect(codes).toContain(fullCode(LspCodes.BudgetExhausted));
  });

  test("does not report it for a run within the budget", async () => {
    const codes = await diagnosticCodes(header);
    expect(codes).not.toContain(fullCode(LspCodes.BudgetExhausted));
  });
});
