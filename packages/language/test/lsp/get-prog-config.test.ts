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
import { PluginConfigurationProvider } from "../../src/workspace/plugin-configuration-provider";
import { EmptyFileSystemProvider } from "../../src/workspace/file-system-provider";
import { UriUtils } from "../../src/utils/uri";
import { makeProgramConfig } from "../config-fixtures";
import { LongRunningOperationImpl } from "../../src/utils/promises";
import { TestGlobalConfigLoader } from "../../src";

function setupConfig(
  programConfig: { program: string; pgroup: string }[],
): PluginConfigurationProvider {
  const pluginConfig = new PluginConfigurationProvider(EmptyFileSystemProvider, new TestGlobalConfigLoader({}), LongRunningOperationImpl.Dummy); 
  pluginConfig.setProgramConfigs(
    UriUtils.toUri("/workspace"),
    programConfig.map(makeProgramConfig),
  );
  return pluginConfig;
}

describe("Check if `getProgramConfig` inside `PluginConfigurationProvider` retrieve proper values.", () => {
  (test("Matches workspace-relative program - most common use case", async () => {
    const pluginConfig = setupConfig([{ program: "*.pli", pgroup: "default" }]);
    const testUri = UriUtils.toUri("workspace/a.pli");
    const config = pluginConfig.getProgramConfig(testUri);

    expect(config).toBeDefined();
  }),
    test("does NOT match absolute path outside workspace that isn't explicitely included as program", async () => {
      const pluginConfig = setupConfig([
        { program: "*.pli", pgroup: "default" },
      ]);
      const testUri = UriUtils.toUri("C:/Users/pgm/ext-pgm.pli");
      const config = pluginConfig.getProgramConfig(testUri);

      expect(config).toBeUndefined();
    }),
    test("return match for absolute Windows-style path properly registered", async () => {
      const pluginConfig = setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "C:/Users/pgm/ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = UriUtils.toUri("C:/Users/pgm/ext-pgm.pli");
      const config = pluginConfig.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }),
    test("return match for properly registered absolute Windows-style with backslashes against normalized URI path.", async () => {
      const pluginConfig = setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "C:\\Users\\pgm\\ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = UriUtils.toUri("C:/Users/pgm/ext-pgm.pli");
      const config = pluginConfig.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }),
    test("matches absolute UNIX style path", async () => {
      const pluginConfig = setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "/Users/pgm/ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = UriUtils.toUri("/Users/pgm/ext-pgm.pli");
      const config = pluginConfig.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }));
});
