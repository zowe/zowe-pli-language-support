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
import { validatePgroupReferences } from "../../src/config/cross-validation";
import {
  plainItem,
  ProgramConfig,
} from "../../src/workspace/plugin-configuration-provider";
import { Range, Severity } from "../../src/language-server/types";
import { UriUtils } from "../../src/utils/uri";
import { makeProgramConfig } from "../config-fixtures";

/**
 * The pgm_conf.json text we use as the source document in these tests.
 *
 * Tests that care about precise ranges build a `ProgramConfig` whose
 * `pgroup.meta.range` points at the start/end offsets of the substring
 * they want highlighted. `PGM_CONF_TEXT.indexOf(...)` gives byte offsets
 * directly — no TextDocument needed since `validatePgroupReferences` now
 * works with internal byte-offset diagnostics.
 */
const PGM_CONF_TEXT = JSON.stringify(
  {
    pgms: [
      { program: "a.pli", pgroup: "default" },
      { program: "b.pli", pgroup: "doesnotexist" },
    ],
  },
  null,
  2,
);

const PGM_CONF_URI = UriUtils.toUri("/workspace/.pliplugin/pgm_conf.json");

/**
 * Builds a {@link ProgramConfig} whose `pgroup` field carries a real
 * `meta` block (range/uri/path), unlike {@link makeProgramConfig} which
 * uses {@link plainItem} and therefore has no source location.
 *
 * We need this here because some tests assert on the *exact* range that
 * ends up in the emitted diagnostic — that only works when the input
 * actually has a range to read.
 */
function makeProgramWithPgroupRange(
  program: string,
  pgroup: string,
  range: Range,
): ProgramConfig {
  return {
    program: plainItem(program),
    pgroup: {
      value: pgroup,
      meta: {
        range,
        uri: PGM_CONF_URI,
        path: ["pgms", 0, "pgroup"],
      },
    },
    compilerOptions: [],
  };
}

describe("validatePgroupReferences", () => {
  test("emits one diagnostic, with the full expected shape, for a single unknown pgroup", () => {
    /*
     * We pin down the exact substring offsets in the document so we can assert
     * on the LSP range. The doc looks like (indented JSON):
     *   {
     *     "pgms": [
     *       { "program": "a.pli", "pgroup": "default" },
     *       { "program": "b.pli", "pgroup": "doesnotexist" }
     *     ]
     *   }
     * — and we point the meta at the `"doesnotexist"` token (quotes included).
     */
    const literalWithQuotes = `"doesnotexist"`;
    const offset = PGM_CONF_TEXT.indexOf(literalWithQuotes);
    const programs = [
      makeProgramConfig({ program: "a.pli", pgroup: "default" }),
      makeProgramWithPgroupRange("b.pli", "doesnotexist", {
        start: offset,
        end: offset + literalWithQuotes.length,
      }),
    ];
    const pgroupNames = new Set(["default", "lelola"]);

    const result = validatePgroupReferences(
      programs,
      pgroupNames,
      PGM_CONF_URI.toString(),
    );

    expect(result).toHaveLength(1);
    // Lock the full diagnostic contract — drift in any field (severity,
    // code, message, source, range, uri) will surface as a single clear diff.
    expect(result[0]).toEqual({
      severity: Severity.E,
      message: `Unknown process group 'doesnotexist'.`,
      code: "COPC04E",
      range: {
        start: offset,
        end: offset + literalWithQuotes.length,
      },
      uri: PGM_CONF_URI.toString(),
    });
  });

  test("falls back to a default range when a ProgramConfig was built without meta (no crash)", () => {
    // ProgramConfigs built via `plainItem` (test fixtures, programmatic
    // construction) have no meta. We must still produce a diagnostic — not
    // crash — and the range falls back to offsetLengthToRange(0, 1).
    const programs = [
      makeProgramConfig({ program: "a.pli", pgroup: "unknown" }),
    ];

    const result = validatePgroupReferences(
      programs,
      new Set(["default"]),
      PGM_CONF_URI.toString(),
    );

    expect(result).toHaveLength(1);
    expect(result[0].range).toEqual({
      start: 0,
      end: 1,
    });
  });

  test("accepts any Iterable<ProgramConfig> — works with Map.values() as well as an array", () => {
    // The function signature advertises Iterable<ProgramConfig>. Tests both
    // common shapes so a future tightening of the parameter type (e.g. to
    // ProgramConfig[]) would surface here.
    const map = new Map<string, ProgramConfig>([
      ["a", makeProgramConfig({ program: "a.pli", pgroup: "default" })],
      ["b", makeProgramConfig({ program: "b.pli", pgroup: "doesnotexist" })],
    ]);

    const result = validatePgroupReferences(
      map.values(),
      new Set(["default"]),
      PGM_CONF_URI.toString(),
    );

    expect(result).toHaveLength(1);
    expect(result[0].message).toBe(`Unknown process group 'doesnotexist'.`);
  });
});
