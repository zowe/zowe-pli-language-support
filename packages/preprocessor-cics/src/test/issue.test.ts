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

describe("CICS ISSUE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (ABEND)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ISSUE ABEND");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ISSUE ABEND BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkAdd -> checkHasMandatoryOptions(FROM)
  test("ADD missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ADD DESTID(D)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkAdd -> checkHasIllegalOptions(RRN) without RIDFLD
  test("ADD RRN without RIDFLD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ADD DESTID(D) FROM(FF) RRN",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: RRN without RIDFLD/,
    );
  });

  // checkErase -> checkHasExactlyOneOption(RRN or KEYLENGTH)
  test("ERASE without RRN or KEYLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ERASE RIDFLD(R) DESTID(D)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: RRN or KEYLENGTH/,
    );
  });

  // checkPass -> checkHasMandatoryOptions(LUNAME)
  test("PASS missing LUNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ISSUE PASS");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: LUNAME/);
  });

  // checkReceive -> checkHasMandatoryOptions(INTO or SET)
  test("RECEIVE without INTO or SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ISSUE RECEIVE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: INTO or SET/,
    );
  });

  // checkSignal -> checkHasIllegalOptions(SESSION) with CONVID
  test("SIGNAL SESSION with CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE SIGNAL CONVID(CV) SESSION(SES)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: SESSION with CONVID/,
    );
  });

  // checkIssueCommon -> DESTIDLENG without DESTID
  test("ABORT DESTIDLENG without DESTID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ABORT DESTIDLENG(D)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: DESTIDLENG without DESTID/,
    );
  });

  // checkDuplicates
  test("Duplicated ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ADD ADD DESTID(DD) FROM(FF)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Excessive options provided for: ADD/);
  });
});
