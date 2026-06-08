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

describe("CICS ACQUIRE TERMINAL", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) NOQUEUE",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  test("Duplicated TERMINAL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) TERMINAL(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TERMINAL/,
    );
  });

  test("Duplicated NOQUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) NOQUEUE NOQUEUE",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: NOQUEUE/,
    );
  });

  test("Mutual exclusive NOQUEUE and QNOTENAB", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) NOQUEUE QNOTENAB",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].startOffset).toBe(22);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: NOQUEUE or QALL or QNOTENAB or QSESSLIM/,
    );
    expect(diagnostics[1].severity).toBe(Severity.Error);
    expect(diagnostics[1].startOffset).toBe(30);
    expect(diagnostics[1].message).toMatch(
      /Exactly one option required, options are mutually exclusive: NOQUEUE or QALL or QNOTENAB or QSESSLIM/,
    );
  });

  test("RELREQ without QALL or QSESSLIM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) RELREQ",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: RELREQ without QALL or QSESSLIM/,
    );
  });

  test("USERDATALEN without USERDATA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ACQUIRE TERMINAL(123) USERDATALEN(10)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: USERDATALEN without USERDATA/,
    );
  });
});
