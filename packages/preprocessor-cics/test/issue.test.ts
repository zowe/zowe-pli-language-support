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

describe("CICS ISSUE", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE ABEND BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDuplicates
  test("Duplicated ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ADD ADD DESTID(DD) FROM(FF)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADD/,
    );
  });

  test("Duplicated DESTIDLENG", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ABORT DESTID(DD) DESTIDLENG(DD) DESTIDLENG(DD)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DESTIDLENG/,
    );
  });

  test("Duplicated DESTID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE ABORT DESTID(DD) DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DESTID/,
    );
  });

  test("ABEND", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE ABEND");
    expect(diagnostics).toHaveLength(0);
  });
  test("ABORT (issue common DESTID)", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ABORT DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ABORT SUBADDR CONSOLE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ABORT SUBADDR(SA) CONSOLE",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ABORT DESTIDLENG without DESTID", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ABORT DESTIDLENG(DL)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ADD DESTID(DD) FROM(FF)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ADD missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ADD DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("ADD RRN without RIDFLD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ADD DESTID(DD) FROM(FF) RRN",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("CONFIRMATION", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE CONFIRMATION");
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE COPY TERMID(TM)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("DISCONNECT", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE DISCONNECT");
    expect(diagnostics).toHaveLength(0);
  });
  test("END", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE END");
    expect(diagnostics).toHaveLength(0);
  });
  test("EODS", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE EODS");
    expect(diagnostics).toHaveLength(0);
  });
  test("ERASE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ERASE RIDFLD(RF) DESTID(DD) RRN",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ERASE without RRN or KEYLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE ERASE RIDFLD(RF) DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("ERROR", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE ERROR");
    expect(diagnostics).toHaveLength(0);
  });
  test("LOAD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE LOAD PROGRAM(PG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("NOTE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE NOTE DESTID(DD) RIDFLD(RF) RRN",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("PASS", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE PASS LUNAME(LU)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("PASS missing LUNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE PASS");
    expect(diagnostics).toHaveLength(1);
  });
  test("PREPARE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE PREPARE");
    expect(diagnostics).toHaveLength(0);
  });
  test("PRINT", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE PRINT");
    expect(diagnostics).toHaveLength(0);
  });
  test("QUERY", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE QUERY DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RECEIVE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE RECEIVE INTO(IN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RECEIVE with conflicting INTO/SET and missing LENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ISSUE RECEIVE INTO(IN) SET(NAME)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "INTO or SET" are mutually exclusive/,
    );
    expect(diagnostics[1].severity).toBe(Severity.Error);
    expect(diagnostics[1].message).toMatch(/Missing required option: LENGTH/);
  });
  test("RECEIVE without INTO or SET", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE RECEIVE");
    expect(diagnostics).toHaveLength(1);
  });
  test("REPLACE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE REPLACE DESTID(DD) RIDFLD(RF) FROM(FF) RRN",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SEND", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE SEND FROM(FF) DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SIGNAL", async () => {
    const { diagnostics } = await cicsPreprocessor.parse("ISSUE SIGNAL");
    expect(diagnostics).toHaveLength(0);
  });
  test("SIGNAL SESSION with CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE SIGNAL CONVID(CV) SESSION(SES)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("WAIT", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "ISSUE WAIT DESTID(DD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
