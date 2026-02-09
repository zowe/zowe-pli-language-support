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
  PluginConfigurationProvider,
  PluginConfigurationProviderInstance,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI } from "../../src/utils/uri";

async function setupConfig(
  programConfig: { program: string; pgroup: string }[],
) {
  const pluginConfig = new PluginConfigurationProvider();
  setPluginConfigurationProvider(pluginConfig);
  pluginConfig.setProgramConfigs("/workspace", programConfig);
}

describe("Check if `getProgramConfig` inside `PluginConfigurationProvider` retrieve proper values.", () => {
  (test("Matches workspace-relative program - most common use case", async () => {
    await setupConfig([{ program: "*.pli", pgroup: "default" }]);
    const testUri = URI.parse("workspace/a.pli");
    const config =
      PluginConfigurationProviderInstance.getProgramConfig(testUri);

    expect(config).toBeDefined();
  }),
    test("does NOT match absolute path outside workspace that isn't explicitely included as program", async () => {
      await setupConfig([{ program: "*.pli", pgroup: "default" }]);
      const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
      const config =
        PluginConfigurationProviderInstance.getProgramConfig(testUri);

      expect(config).toBeUndefined();
    }),
    test("return match for absolute Windows-style path properly registered", async () => {
      await setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "C:/Users/pgm/ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
      const config =
        PluginConfigurationProviderInstance.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }),
    test("return match for properly registered absolute Windows-style with backslashes against normalized URI path.", async () => {
      await setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "C:\\Users\\pgm\\ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
      const config =
        PluginConfigurationProviderInstance.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }),
    test("matches absolute UNIX style path", async () => {
      await setupConfig([
        { program: "*.pli", pgroup: "default" },
        { program: "Users/pgm/ext-pgm.pli", pgroup: "default" },
      ]);
      const testUri = URI.parse("Users/pgm/ext-pgm.pli");
      const config =
        PluginConfigurationProviderInstance.getProgramConfig(testUri);

      expect(config).toBeDefined();
    }));
});
