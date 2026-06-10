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

describe("CICS WAIT", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive (CONVID)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WAIT CONVID(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("WAIT CONVID(1) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkEvent -> checkHasMandatoryOptions(ECADDR)
  test("EVENT missing ECADDR", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WAIT EVENT");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ECADDR/);
  });

  // checkExternal -> checkHasMutuallyExclusiveOptions
  test("EXTERNAL mutually exclusive PURGEABLE and NOTPURGEABLE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAIT EXTERNAL ECBLIST(1) NUMEVENTS(2) PURGEABLE NOTPURGEABLE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: PURGEABLE or PURGEABILITY or NOTPURGEABLE/,
    );
  });

  // checkDuplicates
  test("Duplicated CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAIT CONVID(1) CONVID(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONVID/,
    );
  });
});
