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
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";
import { Severity } from "preprocessor-api";

describe("CICS SYNCPOINT", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (no options)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("SYNCPOINT");
    expect(diagnostics).toHaveLength(0);
  });

  test("Positive (ROLLBACK)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("SYNCPOINT ROLLBACK");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse("SYNCPOINT BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  test("Duplicated ROLLBACK", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SYNCPOINT ROLLBACK ROLLBACK",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ROLLBACK/,
    );
  });
});
