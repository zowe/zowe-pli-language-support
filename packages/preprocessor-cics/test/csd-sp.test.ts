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

describe("CICS CSD (SP)", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD LIST(L) GROUP(G) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDuplicates
  test("Duplicated ADD", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD ADD LIST(L) GROUP(G)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADD/,
    );
  });

  test("ADD", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD LIST(LL) GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ADD missing GROUP", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD ADD LIST(LL)");
    expect(diagnostics).toHaveLength(1);
  });
  test("ALTER", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ALTER RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ALTER missing RESID", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ALTER GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("APPEND", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD APPEND LIST(LL) TO(TT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD COPY GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY without AS or TO", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD COPY GROUP(GG)");
    expect(diagnostics).toHaveLength(1);
  });
  test("DEFINE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD DEFINE RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("DELETE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD DELETE GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTGROUP", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTLIST", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTLIST LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE ATTRLEN without ATTRIBUTES/SET", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRLEN(AL)",
    );
    expect(diagnostics).toHaveLength(2);
  });
  test("INQUIREGROUP", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INQUIREGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRELIST", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INQUIRELIST LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRERSRCE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INQUIRERSRCE RESID(RR) GROUP(GG) PROGRAM ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INSTALL GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL LIST with cvda illegal", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INSTALL LIST(LL) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("LOCK", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD LOCK GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("REMOVE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD REMOVE GROUP(GG) LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RENAME", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD RENAME GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("STARTBRRSRCE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD STARTBRRSRCE GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("UNLOCK", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD UNLOCK GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("USERDEFINE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD USERDEFINE GROUP(GG) ATTRIBUTES(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
