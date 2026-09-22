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

import { afterEach, describe, expect, test } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CancellationToken,
  CancellationTokenSource,
} from "vscode-languageserver";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { defaultTestWorkspace } from "../test-workspace";
import {
  OperationCancelled,
  setInterruptionPeriod,
} from "../../src/utils/promises";

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
  afterEach(() => {
    // Restore the default period of `interruptAndCheck`.
    setInterruptionPeriod(10);
  });

  test("runs the loop to completion when not cancelled", async () => {
    expect(await preprocess(CancellationToken.None)).toContain("5000");
  });

  test("rejects an already-cancelled request without doing the work", async () => {
    const source = new CancellationTokenSource();
    source.cancel();
    await expect(preprocess(source.token)).rejects.toBe(OperationCancelled);
  });

  test("gives up an in-flight run once the request is cancelled", async () => {
    // Yield at every poll, so the cancellation set below (a macrotask) is observable
    // even though the interpreter is CPU-bound.
    setInterruptionPeriod(0);
    const source = new CancellationTokenSource();
    setTimeout(() => source.cancel(), 0);
    await expect(preprocess(source.token)).rejects.toBe(OperationCancelled);
  });
});
