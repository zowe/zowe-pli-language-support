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
import {
  CancellationToken,
  CancellationTokenSource,
} from "vscode-languageserver";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { defaultTestWorkspace } from "../test-workspace";

// A loop long enough to run past the interpreter's cancellation polling interval.
// Column 1 is outside the default margins, so every line starts with a blank.
const text = [
  " %DCL I FIXED;",
  " %DCL X FIXED;",
  " %X = 0;",
  " %DO I = 1 TO 5000;",
  "   %X = X + 1;",
  " %END;",
  " %ACT X;",
  " X",
].join("\n");

async function preprocess(cancellation: CancellationToken): Promise<string> {
  const lexer = new PliLexer();
  const uri = UriUtils.toUri("/test/cancellation.pli");
  const document = TextDocument.create(uri.toString(), "pli", 0, text);
  const unit = await createCompilationUnit(uri, defaultTestWorkspace());
  const result = await lexer.tokenize(unit, document, uri, cancellation);
  return result.preprocessedText;
}

describe("Macro interpreter cancellation", () => {
  test("runs the loop to completion when not cancelled", async () => {
    expect(await preprocess(CancellationToken.None)).toContain("5000");
  });

  test("gives up an in-flight run once the request is cancelled", async () => {
    const source = new CancellationTokenSource();
    source.cancel();
    const preprocessedText = await preprocess(source.token);
    // The interpreter stopped inside the loop, so neither the final counter value nor
    // the `%ACT X` that follows the loop had a chance to take effect.
    expect(preprocessedText).not.toContain("5000");
  });
});
