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

describe("CICS SEND", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (group1)", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("SEND FROM(VAR)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("SEND FROM(VAR) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkGroup1 -> checkHasMutuallyExclusiveOptions(LENGTH or FLENGTH)
  test("group1 LENGTH and FLENGTH mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND FROM(VAR) LENGTH(1) FLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: LENGTH or FLENGTH/,
    );
  });

  // checkControl -> checkHasMandatoryOptions(MAP)
  test("CONTROL MAPONLY missing MAP", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND CONTROL MAPONLY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: MAP/);
  });

  // checkPage -> checkHasMandatoryOptions(RELEASE) when TRANSID
  test("PAGE TRANSID without RELEASE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND PAGE TRANSID(TR)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RELEASE/);
  });

  // checkText -> checkHasMandatoryOptions(FROM)
  test("TEXT missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("SEND TEXT");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkTextMapped -> checkHasMandatoryOptions(FROM)
  test("TEXT MAPPED missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("SEND TEXT MAPPED");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkTextNoedit -> checkHasMandatoryOptions(ERASE) when DEFAULT
  test("TEXT NOEDIT DEFAULT without ERASE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND TEXT NOEDIT FROM(VAR) DEFAULT",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ERASE/);
  });

  // checkMappingdev -> checkHasMandatoryOptions(SET)
  test("MAPPINGDEV missing SET", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND MAP(MP) MAPPINGDEV(MD) FROM(VAR)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SET/);
  });

  // checkDuplicates
  test("Duplicated FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "SEND FROM(VAR) FROM(VAR2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FROM/,
    );
  });
});
