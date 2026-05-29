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

describe("CICS TEST EVENT", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TEST EVENT(123) FIRESTATUS(NORMAL)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TEST EVENT(123) FIRESTATUS(NORMAL) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkTestEvent -> checkHasMandatoryOptions(EVENT)
  test("Missing EVENT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TEST FIRESTATUS(NORMAL)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: EVENT/);
  });

  // checkTestEvent -> checkHasMandatoryOptions(FIRESTATUS)
  test("Missing FIRESTATUS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("TEST EVENT(123)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: FIRESTATUS/,
    );
  });

  // checkDuplicates
  test("Duplicated EVENT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TEST EVENT(123) EVENT(456) FIRESTATUS(NORMAL)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: EVENT/,
    );
  });
});
