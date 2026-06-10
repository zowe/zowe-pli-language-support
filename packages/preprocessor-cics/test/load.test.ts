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

describe("CICS LOAD", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("LOAD PROGRAM(P)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LOAD PROGRAM(P) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkLoad -> checkHasMandatoryOptions
  test("Missing PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("LOAD HOLD");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkLoad -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive LENGTH and FLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LOAD PROGRAM(P) LENGTH(5) FLENGTH(6)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: LENGTH or FLENGTH/,
    );
  });

  // checkDuplicates (warning severity)
  test("Duplicated HOLD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LOAD PROGRAM(P) HOLD HOLD",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: HOLD/,
    );
  });
});
