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

describe("CICS CONVERTTIME", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERTTIME ABSTIME(123) DATESTRING(456)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERTTIME ABSTIME(123) DATESTRING(456) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkConvertTime -> checkHasMandatoryOptions(ABSTIME)
  test("Missing ABSTIME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERTTIME DATESTRING(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ABSTIME/);
  });

  // checkConvertTime -> checkHasMandatoryOptions(DATESTRING)
  test("Missing DATESTRING", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERTTIME ABSTIME(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: DATESTRING/,
    );
  });

  // checkDuplicates
  test("Duplicated ABSTIME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERTTIME ABSTIME(123) ABSTIME(456) DATESTRING(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ABSTIME/,
    );
  });
});
