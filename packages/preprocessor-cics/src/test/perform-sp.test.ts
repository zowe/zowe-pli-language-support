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

describe("CICS PERFORM (SP)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (DUMP)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMPCODE(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMPCODE(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkDump -> checkHasMandatoryOptions(DUMPCODE)
  test("DUMP missing DUMPCODE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("PERFORM DUMP");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DUMPCODE/);
  });

  // checkDump -> checkAllOptionsArePresentOrAbsent(TITLE, TITLELENGTH)
  test("DUMP TITLE without TITLELENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMPCODE(1) TITLE(T)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /If one option is specified, all options must be present: TITLE, TITLELENGTH/,
    );
  });

  // checkDumpDuplicates
  test("DUMP duplicated DUMP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMP DUMPCODE(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DUMP/,
    );
  });

  // checkEndAffinity -> checkHasMandatoryOptions(NETNAME)
  test("ENDAFFINITY missing NETNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM ENDAFFINITY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: NETNAME/);
  });

  // checkSecdiscovery -> checkHasExactlyOneOption(ACTION or WRITE)
  test("SECDISCOVERY without ACTION or WRITE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM SECDISCOVERY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACTION or WRITE/,
    );
  });

  // checkSecurity -> checkHasMandatoryOptions(REBUILD)
  test("SECURITY missing REBUILD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("PERFORM SECURITY");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: REBUILD/);
  });

  // checkSsl -> checkHasMandatoryOptions(REBUILD)
  test("SSL missing REBUILD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("PERFORM SSL");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: REBUILD/);
  });

  // checkShutdown -> checkHasIllegalOptions(RESTART) when IMMEDIATE
  test("SHUTDOWN IMMEDIATE with RESTART", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM SHUTDOWN IMMEDIATE RESTART",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: RESTART/);
  });

  // checkStatistics -> checkHasMandatoryOptions(RECORD)
  test("STATISTICS missing RECORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM STATISTICS",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RECORD/);
  });

  // checkAll -> ALL combined with individual resource types
  test("STATISTICS ALL combined with resource", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM STATISTICS RECORD ALL CONNECTION",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Option ALL cannot be combined with individual resource types/,
    );
  });

  // checkJvmServer -> checkHasExactlyOneOption(JVMTYPE or JVM or LIBERTY or OSGI)
  test("JVMSERVER without JVMTYPE/JVM/LIBERTY/OSGI", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(AREA)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: JVMTYPE or JVM or LIBERTY or OSGI/,
    );
  });

  // checkDuplicates
  test("Duplicated DUMPCODE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMPCODE(1) DUMPCODE(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DUMPCODE/,
    );
  });
});
