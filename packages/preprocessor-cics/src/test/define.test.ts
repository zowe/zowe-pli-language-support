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

describe("CICS DEFINE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (ACTIVITY)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE ACTIVITY(1) TRANSID(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE ACTIVITY(1) TRANSID(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkActivity -> checkHasMandatoryOptions(TRANSID)
  test("ACTIVITY missing TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE ACTIVITY(1) PROGRAM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TRANSID/);
  });

  // checkCompositeEvent -> checkHasExactlyOneOption (AND or OR none)
  test("COMPOSITE without AND or OR", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE COMPOSITE EVENT(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: AND or OR/,
    );
  });

  // checkDuplicates
  test("Duplicated TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE ACTIVITY(1) TRANSID(2) TRANSID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TRANSID/,
    );
  });
});
