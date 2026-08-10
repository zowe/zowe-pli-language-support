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

describe("CICS INQUIRE (system programming)", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE ADDRESS(AD) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // storage -> checkHasExactlyOneOption(ADDRESS or NUMELEMENTS)
  test("STORAGE without ADDRESS or NUMELEMENTS", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE STORAGE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ADDRESS or NUMELEMENTS/,
    );
  });

  // vtam -> checkHasMutuallyExclusiveOptions
  test("VTAM PSDINTERVAL and PSDINTHRS mutually exclusive", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE VTAM PSDINTERVAL(PI) PSDINTHRS(PH)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: PSDINTHRS with PSDINTERVAL/,
    );
  });

  // checkDuplicates
  test("Duplicated ADDRESS", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE ADDRESS(AD) ADDRESS(AD2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADDRESS/,
    );
  });

  test("association_list", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE ASSOCIATION LIST LISTSIZE(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("bundle", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE BUNDLE(BN)");
    expect(diagnostics).toHaveLength(0);
  });
  test("bundle browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE BUNDLE START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("bundlepart", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE BUNDLEPART(BP) START BUNDLE(BN)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("bundlepart end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE BUNDLEPART(BP) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("capdatapred", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPDATAPRED START CAPTURESPEC(CS) EVENTBINDING(EB)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capdatapred end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPDATAPRED END",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capdatapred next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPDATAPRED NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capinfosrce", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPINFOSRCE START CAPTURESPEC(CS) EVENTBINDING(EB)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capinfosrce end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPINFOSRCE END",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capinfosrce next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPINFOSRCE NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capoptpred", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPOPTPRED START CAPTURESPEC(CS) EVENTBINDING(EB)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capoptpred end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPOPTPRED END",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capoptpred next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPOPTPRED NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("capturespec", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPTURESPEC(CS) START EVENTBINDING(EB)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("capturespec end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE CAPTURESPEC(CS) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("deletshipped", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE DELETSHIPPED",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("enq next", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE ENQ NEXT");
    expect(diagnostics).toHaveLength(0);
  });
  test("enq end", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE ENQ END");
    expect(diagnostics).toHaveLength(0);
  });
  test("epadaptinset", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EPADAPTINSET EPADAPTERSET(ES) EPADAPTER(EP)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("epadaptinset browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EPADAPTINSET START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("epadaptinset next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EPADAPTINSET NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("exitprogram", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EXITPROGRAM(EX)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("exitprogram browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EXITPROGRAM START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("exitprogram next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE EXITPROGRAM NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("featurekey", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE FEATUREKEY(FK) VALUE(VL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("featurekey browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE FEATUREKEY START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("statistics", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE STATISTICS");
    expect(diagnostics).toHaveLength(0);
  });
  test("jvmendpoint", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE JVMENDPOINT(JE) START JVMSERVER(JS)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("jvmendpoint end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE JVMENDPOINT(JE) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("modename", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE MODENAME(MN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("modename browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE MODENAME START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("mvstcb next", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE MVSTCB NEXT");
    expect(diagnostics).toHaveLength(1);
  });
  test("mvstcb start", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE MVSTCB START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("netname", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE NETNAME(NN)");
    expect(diagnostics).toHaveLength(0);
  });
  test("netname browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE NETNAME START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("osgibundle", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE OSGIBUNDLE(OB) START JVMSERVER(JS)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("osgibundle end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE OSGIBUNDLE(OB) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("osgiservice", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE OSGISERVICE(OS) START JVMSERVER(JS)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("osgiservice end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE OSGISERVICE(OS) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("policyrule", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE POLICYRULE(PR) START POLICY(PL)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("policyrule end", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE POLICYRULE(PR) END",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("program", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE PROGRAM(PG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("program browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE PROGRAM START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("program end", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE PROGRAM END");
    expect(diagnostics).toHaveLength(0);
  });
  test("reqid", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE REQID(RQ)");
    expect(diagnostics).toHaveLength(0);
  });
  test("reqid browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE REQID START");
    expect(diagnostics).toHaveLength(0);
  });
  test("storage", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE ADDRESS(AD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("storage numelements", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE NUMELEMENTS(NE)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("storage64", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE64 ADDRESS64(AD)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("storage64 numelements", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE STORAGE64 NUMELEMENTS(NE)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("subpool", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE SUBPOOL(SP)");
    expect(diagnostics).toHaveLength(0);
  });
  test("subpool browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE SUBPOOL START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("tag next", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE TAG NEXT");
    expect(diagnostics).toHaveLength(1);
  });
  test("tag start", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE TAG START");
    expect(diagnostics).toHaveLength(0);
  });
  test("task_list", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TASK LIST LISTSIZE(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("terminal", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TERMINAL(TM)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("terminal browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TERMINAL START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("tracetype", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TRACETYPE STANDARD",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("tranclass", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TRANCLASS(TC)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("tranclass browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TRANCLASS START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("transaction", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TRANSACTION(TR)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("transaction browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TRANSACTION START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("tsqueue", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE TSQUEUE(TQ)");
    expect(diagnostics).toHaveLength(0);
  });
  test("tsqueue browse", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE TSQUEUE START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("uowdsnfail next", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE UOWDSNFAIL NEXT",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("uowdsnfail start", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE UOWDSNFAIL START",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("uowenq next", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE UOWENQ NEXT");
    expect(diagnostics).toHaveLength(0);
  });
  test("uowenq end", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE UOWENQ END");
    expect(diagnostics).toHaveLength(0);
  });
  test("vtam", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE VTAM");
    expect(diagnostics).toHaveLength(0);
  });
  test("common (FILE)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("INQUIRE FILE(FF)");
    expect(diagnostics).toHaveLength(0);
  });
  test("common (ATOMSERVICE)", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "INQUIRE ATOMSERVICE START",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
