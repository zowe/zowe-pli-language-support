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

describe("CICS WSACONTEXT", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (BUILD)", () => {
    const { diagnostics } = cicsPreprocessor.parse("WSACONTEXT BUILD");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("WSACONTEXT BUILD BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkWSAContextBuild -> checkPrerequisiteIsMet
  test("RELATESTYPE without RELATESURI", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "WSACONTEXT BUILD RELATESTYPE(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option for: RELATESTYPE/,
    );
  });

  // checkWSAContextDelete -> checkHasMandatoryOptions(CHANNEL)
  test("DELETE missing CHANNEL", () => {
    const { diagnostics } = cicsPreprocessor.parse("WSACONTEXT DELETE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: CHANNEL/);
  });

  // checkWSAContextGet -> checkHasMandatoryOptions(CONTEXTTYPE)
  test("GET missing CONTEXTTYPE", () => {
    const { diagnostics } = cicsPreprocessor.parse("WSACONTEXT GET CHANNEL(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: CONTEXTTYPE/,
    );
  });

  // checkDuplicates
  test("Duplicated CHANNEL", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "WSACONTEXT DELETE CHANNEL(1) CHANNEL(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CHANNEL/,
    );
  });
});
