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

describe("CICS SPOOLCLOSE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLCLOSE TOKEN(123)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLCLOSE TOKEN(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkSpoolcloseToken -> checkHasMandatoryOptions
  test("Missing TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SPOOLCLOSE KEEP");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TOKEN/);
  });

  // checkSpoolcloseToken -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive KEEP and DELETE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLCLOSE TOKEN(123) KEEP DELETE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: KEEP or DELETE/,
    );
  });

  // checkDuplicates
  test("Duplicated TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLCLOSE TOKEN(123) TOKEN(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TOKEN/,
    );
  });
});
