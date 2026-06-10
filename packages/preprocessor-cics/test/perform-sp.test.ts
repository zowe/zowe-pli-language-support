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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS PERFORM (SP)", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

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
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
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
    const { diagnostics } =
      await cicsPreprocessor.execute("PERFORM STATISTICS");
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

  test("PIPELINE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM PIPELINE(PL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("PIPELINE ACTION and SCAN mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM PIPELINE(PL) ACTION(AC) SCAN",
    );
    expect(diagnostics).toHaveLength(2);
  });
  test("JVMSERVER JVM DUMP branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) JVM DUMP",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("JVMSERVER JVM GATHER branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) JVM GATHER",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("JVMSERVER JVM STACKTRACE missing TASKID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) JVM STACKTRACE",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("JVMSERVER LIBERTY REFRESH branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) LIBERTY REFRESH",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("JVMSERVER OSGI branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) OSGI",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("JVMSERVER APPID else branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM JVMSERVER(JS) APPID(AP)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("DUMP TITLE and TITLELENGTH present", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM DUMP DUMPCODE(DC) TITLE(TT) TITLELENGTH(TL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SHUTDOWN TAKEOVER branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM SHUTDOWN TAKEOVER",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SHUTDOWN PLT and PLTNAME mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "PERFORM SHUTDOWN PLT(PT) PLTNAME(PN)",
    );
    expect(diagnostics).toHaveLength(2);
  });
});
