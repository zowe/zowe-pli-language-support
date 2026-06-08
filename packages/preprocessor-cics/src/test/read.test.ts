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

describe("CICS READ", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) RIDFLD(2) INTO(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) RIDFLD(2) INTO(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkRule -> checkHasExactlyOneOption (FILE or DATASET none)
  test("Neither FILE nor DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ RIDFLD(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FILE or DATASET/,
    );
  });

  // checkRule -> checkHasMandatoryOptions(RIDFLD)
  test("Missing RIDFLD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RIDFLD/);
  });

  // checkRule -> checkHasExactlyOneOption (INTO or SET none)
  test("Neither INTO nor SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) RIDFLD(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO or SET/,
    );
  });

  // checkRule -> checkPrerequisiteIsMet (TOKEN requires UPDATE)
  test("TOKEN without UPDATE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) RIDFLD(2) INTO(3) TOKEN(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option for: TOKEN without UPDATE/,
    );
  });

  // checkDuplicates
  test("Duplicated FILE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READ FILE(1) FILE(2) RIDFLD(3) INTO(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FILE/,
    );
  });
});
