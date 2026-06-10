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

describe("CICS ACQUIRE", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  test("Duplicated PROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE PROCESS(ABC) PROCESS(DEF) PROCESSTYPE(XYZ)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROCESS/,
    );
  });

  test("Duplicated PROCESSTYPE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ) PROCESSTYPE(DEF)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROCESSTYPE/,
    );
  });

  test("Missing PROCESSTYPE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE PROCESS(ABC)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: PROCESSTYPE/,
    );
  });
});
