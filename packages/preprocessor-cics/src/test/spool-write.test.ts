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

describe("CICS SPOOLWRITE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE TOKEN(123) FROM(456)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE TOKEN(123) FROM(456) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkSpoolwrite -> checkHasMandatoryOptions(TOKEN)
  test("Missing TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE FROM(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TOKEN/);
  });

  // checkSpoolwrite -> checkHasMandatoryOptions(FROM)
  test("Missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE TOKEN(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkSpoolwrite -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive LINE and PAGE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE TOKEN(123) FROM(456) LINE PAGE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: LINE or PAGE/,
    );
  });

  // checkDuplicates
  test("Duplicated TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLWRITE TOKEN(123) TOKEN(456) FROM(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TOKEN/,
    );
  });
});
