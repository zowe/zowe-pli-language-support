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

describe("CICS RUN", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RUN ACTIVITY(1) SYNCHRONOUS",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("RUN without any options", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RUN");
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Unexpected end of file/);
    expect(diagnostics[1].severity).toBe(Severity.Error);
    expect(diagnostics[1].message).toMatch(
      /Exactly one option required, none provided: ACQACTIVITY, ACQPROCESS, ACTIVITY or TRANSID/,
    );
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RUN ACTIVITY(1) SYNCHRONOUS BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDefaultRun -> checkHasExactlyOneOption (none provided)
  test("Default without ACTIVITY/ACQACTIVITY/ACQPROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RUN SYNCHRONOUS");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACTIVITY or ACQACTIVITY or ACQPROCESS/,
    );
  });

  // checkDefaultRun -> checkHasMandatoryOptions(SYNCHRONOUS/ASYNCHRONOUS/FACILITYTOKN)
  test("Default missing SYNCHRONOUS/ASYNCHRONOUS/FACILITYTOKN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RUN ACTIVITY(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: SYNCHRONOUS or ASYNCHRONOUS or FACILITYTOKN/,
    );
  });

  // checkTransidRun -> checkHasMandatoryOptions(CHILD)
  test("Transid missing CHILD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RUN TRANSID(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: CHILD/);
  });

  // checkDuplicates
  test("Duplicated ACTIVITY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RUN ACTIVITY(1) ACTIVITY(2) SYNCHRONOUS",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ACTIVITY/,
    );
  });
});
