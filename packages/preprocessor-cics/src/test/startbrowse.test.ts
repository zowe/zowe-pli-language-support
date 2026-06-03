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

describe("CICS STARTBROWSE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "STARTBROWSE ACTIVITY BROWSETOKEN(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "STARTBROWSE ACTIVITY BROWSETOKEN(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkBody -> checkHasMandatoryOptions(BROWSETOKEN)
  test("Missing BROWSETOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "STARTBROWSE ACTIVITY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: BROWSETOKEN/,
    );
  });

  // checkBody -> checkHasExactlyOneOption (no browse type provided)
  test("Missing browse type", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "STARTBROWSE BROWSETOKEN(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACTIVITY, CONTAINER, PROCESS, EVENT or TIMER/,
    );
  });

  // checkBody (PROCESS branch) -> checkHasMandatoryOptions(PROCESSTYPE)
  test("PROCESS missing PROCESSTYPE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "STARTBROWSE PROCESS BROWSETOKEN(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: PROCESSTYPE/,
    );
  });
});
