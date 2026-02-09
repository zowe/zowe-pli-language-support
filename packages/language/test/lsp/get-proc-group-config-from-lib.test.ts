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
  deserializeProcessGroup,
  PluginConfigurationProvider,
  PluginConfigurationProviderInstance,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI } from "../../src/utils/uri";

async function setupConfig(testLibs: string[]) {
  const pluginConfig = new PluginConfigurationProvider();
  setPluginConfigurationProvider(pluginConfig);
  const processGroup = deserializeProcessGroup({
    name: "default",
    "include-extensions": [".pli"],
    libs: testLibs,
  });
  await pluginConfig.setProcessGroupConfigs([processGroup]);
}

describe("Process group library path matching", () => {
  test("matches library under workspace-relative lib directory", async () => {
    await setupConfig(["cpy"]);
    const testUri = URI.parse("/workspace/cpy/a.pli");
    const config =
      PluginConfigurationProviderInstance.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches absolute Windows-style library path", async () => {
    await setupConfig(["cpy", "C:/Users/pgm"]);
    const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
    const config =
      PluginConfigurationProviderInstance.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches backslash Windows library path against normalized URI", async () => {
    await setupConfig(["cpy", "C:\\Users\\pgm"]);
    const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
    const config =
      PluginConfigurationProviderInstance.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches configured library regardless of platform path differences", async () => {
    await setupConfig(["cpy", "/Users/mockUser/pgm"]);
    const testUri = URI.parse("C:/Users/pgm/ext-pgm.pli");
    const config =
      PluginConfigurationProviderInstance.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });
});
