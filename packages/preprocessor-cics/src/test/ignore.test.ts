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

describe("CICS IGNORE CONDITION", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "IGNORE CONDITION ERROR",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "IGNORE CONDITION ERROR BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkIgnoreCondition -> checkHasMandatoryOptions(CONDITION)
  test("Missing CONDITION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("IGNORE ERROR");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: CONDITION/);
  });

  // checkHasNormalCondition -> NORMAL is not allowed
  test("NORMAL condition is illegal", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "IGNORE CONDITION NORMAL",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: NORMAL/);
  });

  // checkDuplicates (warning severity)
  test("Duplicated CONDITION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "IGNORE CONDITION CONDITION ERROR",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONDITION/,
    );
  });
});
