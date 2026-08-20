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
import {
  parseProcessGroupConfigs,
  parseProgramConfigs,
} from "../../src/config/loader";
import { UriUtils } from "../../src/utils/uri";

const URI = UriUtils.toUri("file:///settings.json");

describe("Loader entry-path navigation", () => {
  test("pgm_conf parses from flat settings-shaped wrapper", () => {
    const text = `{
      "pli.pgm_conf": {
        "pgms": [
          { "program": "a.pli", "pgroup": "default" }
        ]
      }
    }`;
    const result = parseProgramConfigs(text, URI, {
      containerPath: [],
      configKey: "pli.pgm_conf",
    });
    expect(result.diagnostics).toHaveLength(0);
    expect(result.config).toBeDefined();
    expect(result.config!).toHaveLength(1);
    expect(result.config![0].program.value).toBe("a.pli");
    expect(result.config![0].pgroup.value).toBe("default");
  });

  test("pgm_conf parses from .code-workspace-shaped wrapper", () => {
    const text = `{
      "folders": [],
      "settings": {
        "pli.pgm_conf": {
          "pgms": [
            { "program": "a.pli", "pgroup": "default" }
          ]
        }
      }
    }`;
    const result = parseProgramConfigs(text, URI, {
      containerPath: ["settings"],
      configKey: "pli.pgm_conf",
    });
    expect(result.diagnostics).toHaveLength(0);
    expect(result.config!).toHaveLength(1);
    expect(result.config![0].program.value).toBe("a.pli");
  });

  test("ranges in settings-shaped wrapper anchor to absolute offsets", () => {
    const text = `{
      "pli.pgm_conf": {
        "pgms": [
          { "program": "a.pli", "pgroup": "default" }
        ]
      }
    }`;
    const result = parseProgramConfigs(text, URI, {
      containerPath: [],
      configKey: "pli.pgm_conf",
    });
    const meta = result.config![0].program.meta!;
    // Offset-range should slice the literal `"a.pli"` (with quotes) out
    // of the wrapper text, proving ranges are absolute in the source.
    expect(text.substring(meta.range.start, meta.range.end)).toBe('"a.pli"');
  });

  test("proc_grps parses from flat settings-shaped wrapper", () => {
    const text = `{
      "pli.proc_grps": {
        "pgroups": [
          { "name": "default", "libs": ["cpy"] }
        ]
      }
    }`;
    const result = parseProcessGroupConfigs(text, URI, {
      containerPath: [],
      configKey: "pli.proc_grps",
    });
    expect(result.diagnostics).toHaveLength(0);
    expect(result.config!).toHaveLength(1);
    expect(result.config![0].name.value).toBe("default");
    expect(result.config![0].libs[0].value).toBe("cpy");
  });

  test("legacy mode without entry still parses from root", () => {
    const text = `{
      "pgms": [
        { "program": "a.pli", "pgroup": "default" }
      ]
    }`;
    const result = parseProgramConfigs(text, URI);
    expect(result.diagnostics).toHaveLength(0);
    expect(result.config!).toHaveLength(1);
    expect(result.config![0].program.value).toBe("a.pli");
  });
});
