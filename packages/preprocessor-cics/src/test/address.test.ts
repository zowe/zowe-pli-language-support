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

describe("CICS ADDRESS (SET)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ADDRESS COMMAREA(12)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ADDRESS BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  test("Duplicate COMMAREA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ADDRESS COMMAREA(12) COMMAREA(34)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: COMMAREA/,
    );
  });

  test("Missing USING", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ADDRESS SET(ABC)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: USING/);
  });
});
