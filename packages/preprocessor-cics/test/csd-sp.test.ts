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
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(L) GROUP(G) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDuplicates
  test("Duplicated ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD ADD LIST(L) GROUP(G)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADD/,
    );
  });

  test("ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(LL) GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ADD missing GROUP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("CSD ADD LIST(LL)");
    expect(diagnostics).toHaveLength(1);
  });
  test("ALTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ALTER RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ALTER missing RESID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ALTER GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("APPEND", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD APPEND LIST(LL) TO(TT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD COPY GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY without AS or TO", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("CSD COPY GROUP(GG)");
    expect(diagnostics).toHaveLength(1);
  });
  test("DEFINE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD DEFINE RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("DELETE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD DELETE GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTGROUP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD GETNEXTGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTLIST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD GETNEXTLIST LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE ATTRLEN without ATTRIBUTES/SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRLEN(AL)",
    );
    expect(diagnostics).toHaveLength(2);
  });
  test("INQUIREGROUP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INQUIREGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRELIST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INQUIRELIST LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRERSRCE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INQUIRERSRCE RESID(RR) GROUP(GG) PROGRAM ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INSTALL GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL LIST with cvda illegal", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INSTALL LIST(LL) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("LOCK", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("CSD LOCK GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("REMOVE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD REMOVE GROUP(GG) LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RENAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD RENAME GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("STARTBRRSRCE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD STARTBRRSRCE GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("UNLOCK", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD UNLOCK GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("USERDEFINE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD USERDEFINE GROUP(GG) ATTRIBUTES(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
