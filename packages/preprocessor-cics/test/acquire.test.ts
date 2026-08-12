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

describe("CICS ACQUIRE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  test("Duplicated PROCESS", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ACQUIRE PROCESS(ABC) PROCESS(DEF) PROCESSTYPE(XYZ)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROCESS/,
    );
  });

  test("Duplicated PROCESSTYPE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ACQUIRE PROCESS(ABC) PROCESSTYPE(XYZ) PROCESSTYPE(DEF)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROCESSTYPE/,
    );
  });

  test("Missing PROCESSTYPE", () => {
    const { diagnostics } = cicsPreprocessor.parse("ACQUIRE PROCESS(ABC)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: PROCESSTYPE/,
    );
  });
});
