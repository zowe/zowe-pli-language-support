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

import { afterEach, describe, expect, test } from "vitest";
import { DEFAULT_FILE_URI, TestBuilder } from "./test-builder";
import {
  defaultTestWorkspace,
  setDefaultTestWorkspace,
} from "./test-workspace";
import { UriUtils } from "../src/utils/uri";

/**
 * Guards the "no fs provided" path of {@link TestBuilder.init}: when a caller
 * does not pass its own `fs`, the builder must (1) back the workspace with a
 * real {@link VirtualFileSystemProvider}, (2) write the DEFAULT plugin config
 * files into it, and (3) load them back via `config.init()`. Without the
 * read-side wiring the provider would read from an EmptyFileSystemProvider and
 * silently end up with an empty config — which no other test currently
 * notices.
 */
describe("TestBuilder default plugin configuration (no fs provided)", () => {
  afterEach(() => {
    // The no-fs path replaces the global default workspace; reset it so the
    // singleton can't leak into sibling tests.
    setDefaultTestWorkspace(undefined);
  });

  test("loads the default process group and *.pli program config through the in-memory fs", async () => {
    await TestBuilder.create(
      `
        MAIN: PROC OPTIONS(MAIN);
        END MAIN;
      `,
      // Keep the config after the build so we can inspect what was loaded;
      // otherwise init() clears it on the way out.
      { preservePluginConfiguration: true },
    );

    const config = defaultTestWorkspace().config;

    // The default proc_grps.json was written to the in-memory fs and read back
    // by init() — this only holds if the read-side wiring is live.
    expect(config.getProcessGroupNames()).toContain("default");

    // The default pgm_conf.json maps "*.pli" (match-all), so the main test
    // file must resolve to a program config.
    expect(config.hasProgramConfig(UriUtils.toUri(DEFAULT_FILE_URI))).toBe(
      true,
    );

    // Checks for the process group config based on the default entry
    expect(config.getProcessGroupConfig("default")).toBeDefined();
  });
});
