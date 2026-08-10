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

describe("CICS MOVE", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "MOVE CONTAINER(123) AS(456)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "MOVE CONTAINER(123) AS(456) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkMoveOptions -> checkHasMandatoryOptions(CONTAINER)
  test("Missing CONTAINER", async () => {
    const { diagnostics } = cicsPreprocessor.parse("MOVE AS(456)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: CONTAINER/,
    );
  });

  // checkMoveOptions -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive FROMPROCESS and FROMACTIVITY", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "MOVE CONTAINER(123) AS(456) FROMPROCESS FROMACTIVITY(789)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: FROMPROCESS or FROMACTIVITY/,
    );
  });

  // checkMoveOptions -> checkHasIllegalOptions when FROMPROCESS present
  test("CHANNEL illegal with FROMPROCESS", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "MOVE CONTAINER(123) AS(456) FROMPROCESS CHANNEL(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: CHANNEL with FROMPROCESS/,
    );
  });

  // checkDuplicates
  test("Duplicated CONTAINER", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "MOVE CONTAINER(123) CONTAINER(456) AS(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONTAINER/,
    );
  });
});
