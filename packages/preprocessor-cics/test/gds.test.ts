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

// NOTE: GDS is only valid in Assembly, so the checker always reports the GDS
// keyword as illegal. The cics_gds_opts rule consumes any trailing tokens, so
// there is no EOF/positive case to assert.
describe("CICS GDS", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  // checkGds -> checkHasIllegalOptions(GDS)
  test("GDS is only available in Assembly", async () => {
    const { diagnostics } = cicsPreprocessor.parse("GDS");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: GDS is only available in Assembly/,
    );
  });
});
