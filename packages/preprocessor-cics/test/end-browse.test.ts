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

describe("CICS ENDBROWSE", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENDBROWSE ACTIVITY BROWSETOKEN(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENDBROWSE ACTIVITY BROWSETOKEN(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkEndBrowse -> checkHasExactlyOneOption (none provided)
  test("Missing browse type", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENDBROWSE BROWSETOKEN(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACTIVITY or CONTAINER or EVENT or PROCESS or TIMER/,
    );
  });

  // checkEndBrowse -> checkHasMandatoryOptions(BROWSETOKEN)
  test("Missing BROWSETOKEN", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ENDBROWSE ACTIVITY");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });

  // checkDuplicates
  test("Duplicated BROWSETOKEN", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENDBROWSE ACTIVITY BROWSETOKEN(1) BROWSETOKEN(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: BROWSETOKEN/,
    );
  });
});
