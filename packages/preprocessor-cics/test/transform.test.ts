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

describe("CICS TRANSFORM", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (JSON)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOJSON CHANNEL(1) INCONTAINER(2) TRANSFORMER(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOJSON CHANNEL(1) INCONTAINER(2) TRANSFORMER(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkJSON -> checkHasExactlyOneOption (both -> mutually exclusive)
  test("JSON both DATATOJSON and JSONTODATA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOJSON JSONTODATA CHANNEL(1) INCONTAINER(2) TRANSFORMER(3)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: DATATOJSON or JSONTODATA/,
    );
  });

  // checkJSON -> checkHasMandatoryOptions(TRANSFORMER)
  test("JSON missing TRANSFORMER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOJSON CHANNEL(1) INCONTAINER(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: TRANSFORMER/,
    );
  });

  // checkXML -> checkHasIllegalOptions(NSCONTAINER) when DATATOXML present
  test("XML NSCONTAINER illegal with DATATOXML", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOXML CHANNEL(1) DATCONTAINER(2) XMLTRANSFORM(3) XMLCONTAINER(4) NSCONTAINER(5)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: NSCONTAINER/,
    );
  });

  // checkDuplicates
  test("Duplicated CHANNEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "TRANSFORM DATATOJSON CHANNEL(1) CHANNEL(2) INCONTAINER(3) TRANSFORMER(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CHANNEL/,
    );
  });
});
