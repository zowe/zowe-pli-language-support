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

describe("CICS BUILD ATTACH", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "BUILD ATTACH ATTACHID(123)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "BUILD ATTACH ATTACHID(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAttachIdOptions -> checkHasMandatoryOptions(ATTACH)
  test("Missing ATTACH", async () => {
    const { diagnostics } = cicsPreprocessor.parse("BUILD ATTACHID(123)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ATTACH/);
  });

  // checkAttachIdOptions -> checkHasMandatoryOptions(ATTACHID)
  test("Missing ATTACHID", async () => {
    const { diagnostics } = cicsPreprocessor.parse("BUILD ATTACH");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ATTACHID/);
  });

  // checkDuplicates
  test("Duplicated ATTACHID", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "BUILD ATTACH ATTACHID(123) ATTACHID(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ATTACHID/,
    );
  });
});
