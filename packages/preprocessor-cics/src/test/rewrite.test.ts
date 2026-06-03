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
import { CICSPreprocessor } from "../engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS REWRITE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWRITE FILE(123) FROM(456)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWRITE FILE(123) FROM(456) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkRule -> checkHasExactlyOneOption (none provided)
  test("Neither FILE nor DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("REWRITE FROM(456)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FILE or DATASET/,
    );
  });

  // checkRule -> checkHasExactlyOneOption (both provided -> mutually exclusive)
  test("Both FILE and DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWRITE FILE(123) DATASET(456) FROM(789)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: FILE or DATASET/,
    );
  });

  // checkRule -> checkHasMandatoryOptions(FROM)
  test("Missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("REWRITE FILE(123)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkDuplicates
  test("Duplicated FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWRITE FILE(123) FROM(456) FROM(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FROM/,
    );
  });
});
