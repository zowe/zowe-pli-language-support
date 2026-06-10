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

describe("CICS GETNEXT", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive (ACTIVITY)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETNEXT ACTIVITY(1) BROWSETOKEN(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETNEXT ACTIVITY(1) BROWSETOKEN(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkActivity -> checkHasMandatoryOptions(BROWSETOKEN)
  test("ACTIVITY missing BROWSETOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETNEXT ACTIVITY(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });

  // checkContainer -> checkHasMandatoryOptions(BROWSETOKEN)
  test("CONTAINER missing BROWSETOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETNEXT CONTAINER(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });

  // checkEvent -> checkHasMandatoryOptions(BROWSETOKEN)
  test("EVENT missing BROWSETOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("GETNEXT EVENT(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });

  // checkProcess -> checkHasMandatoryOptions(BROWSETOKEN)
  test("PROCESS missing BROWSETOKEN", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("GETNEXT PROCESS(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });
});
