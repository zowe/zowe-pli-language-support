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

describe("CICS SOAPFAULT", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (CREATE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT CREATE CLIENT FAULTSTRING(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT CREATE CLIENT FAULTSTRING(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkCreate -> checkHasExactlyOneOption (none provided)
  test("CREATE without fault code option", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT CREATE FAULTSTRING(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FAULTCODE, FAULTCODESTR, CLIENT, SERVER, SENDER or RECEIVER/,
    );
  });

  // checkCreate -> checkHasMandatoryOptions(FAULTSTRING)
  test("CREATE missing FAULTSTRING", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT CREATE CLIENT",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: FAULTSTRING/,
    );
  });

  // checkAdd -> checkHasExactlyOneOption (none provided)
  test("ADD without FAULTSTRING or SUBCODESTR", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT ADD NATLANG(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FAULTSTRING or SUBCODESTR/,
    );
  });

  // checkDuplicates
  test("Duplicated FAULTSTRING", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SOAPFAULT CREATE CLIENT FAULTSTRING(1) FAULTSTRING(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FAULTSTRING/,
    );
  });
});
