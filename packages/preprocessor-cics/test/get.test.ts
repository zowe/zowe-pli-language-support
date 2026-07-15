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

describe("CICS GET", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (BTS)", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET CONTAINER(1) ACTIVITY(2) INTO(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET CONTAINER(1) ACTIVITY(2) INTO(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkContainerBTS -> checkHasMandatoryOptions(CONTAINER)
  test("BTS missing CONTAINER", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET ACTIVITY(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: CONTAINER/,
    );
  });

  // checkContainerBTS -> checkHasExactlyOneOption (none provided)
  test("BTS without INTO/SET/NODATA", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET CONTAINER(1) ACTIVITY(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO or SET or NODATA/,
    );
  });

  // checkContainerChannel -> checkHasIllegalOptions(GET64)
  test("GET64 is only available in Assembly", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET64 CONTAINER(1) CHANNEL(2) INTO(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: GET64 is only available in Assembly/,
    );
  });

  // checkDuplicates
  test("Duplicated CONTAINER", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "GET CONTAINER(1) CONTAINER(2) ACTIVITY(3) INTO(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONTAINER/,
    );
  });
});
