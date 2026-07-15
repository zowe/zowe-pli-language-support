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

describe("CICS WSAEPR", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE EPRINTO(1) EPRLENGTH(2) ADDRESS(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE EPRINTO(1) EPRLENGTH(2) ADDRESS(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkWSAEPR -> checkHasMandatoryOptions(EPRLENGTH)
  test("Missing EPRLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE EPRINTO(1) ADDRESS(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: EPRLENGTH/,
    );
  });

  // checkWSAEPR -> checkHasExactlyOneOption (EPRINTO or EPRSET none)
  test("Neither EPRINTO nor EPRSET", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE EPRLENGTH(1) ADDRESS(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: EPRINTO or EPRSET/,
    );
  });

  // checkWSAEPR -> checkHasMandatoryOptions(ADDRESS/REFPARMS/METADATA)
  test("Missing ADDRESS/REFPARMS/METADATA", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE EPRINTO(1) EPRLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: ADDRESS or REFPARMS or METADATA/,
    );
  });

  // checkDuplicates
  test("Duplicated CREATE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "WSAEPR CREATE CREATE EPRINTO(1) EPRLENGTH(2) ADDRESS(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CREATE/,
    );
  });
});
