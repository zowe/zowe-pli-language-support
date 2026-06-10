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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS ENDBR", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ENDBR FILE(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ENDBR FILE(1) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkEndbr -> checkHasExactlyOneOption (none provided)
  test("Neither FILE nor DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ENDBR REQID(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FILE or DATASET/,
    );
  });

  // checkEndbr -> checkHasExactlyOneOption (both -> mutually exclusive)
  test("Both FILE and DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ENDBR FILE(1) DATASET(2)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: FILE or DATASET/,
    );
  });

  // checkDuplicates
  test("Duplicated REQID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ENDBR FILE(1) REQID(2) REQID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: REQID/,
    );
  });
});
