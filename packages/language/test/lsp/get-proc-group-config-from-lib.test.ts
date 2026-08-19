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
} from "../../src/workspace/plugin-configuration-provider";
import { EmptyFileSystemProvider } from "../../src/workspace/file-system-provider";
import { UriUtils } from "../../src/utils/uri";
import { LongRunningOperationImpl } from "../../src/utils/promises";
import { TestGlobalConfigLoader } from "../../src";

async function setupConfig(
  testLibs: string[],
): Promise<PluginConfigurationProvider> {
  const pluginConfig = new PluginConfigurationProvider(
    EmptyFileSystemProvider,
    new TestGlobalConfigLoader({}),
    LongRunningOperationImpl.Dummy,
  );
  await pluginConfig.init(UriUtils.toUri("file:///"));
  const processGroup = deserializeProcessGroup({
    name: "default",
    "include-extensions": [".pli"],
    libs: testLibs,
  });
  await pluginConfig.setProcessGroupConfigs([processGroup]);
  return pluginConfig;
}

describe("Process group library path matching", () => {
  test("matches library under workspace-relative lib directory", async () => {
    const pluginConfig = await setupConfig(["cpy"]);
    const testUri = UriUtils.toUri("/workspace/cpy/a.pli");
    const config = pluginConfig.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches absolute Windows-style library path", async () => {
    const pluginConfig = await setupConfig(["cpy", "C:/Users/mockUser/pgm"]);
    const testUri = UriUtils.toUri("C:/Users/mockUser/pgm/ext-pgm.pli");
    const config = pluginConfig.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches backslash Windows library path against normalized URI", async () => {
    const pluginConfig = await setupConfig(["cpy", "C:\\Users\\mockUser\\pgm"]);
    const testUri = UriUtils.toUri("C:/Users/mockUser/pgm/ext-pgm.pli");
    const config = pluginConfig.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });

  test("matches absolute path lib for Unix environments", async () => {
    const pluginConfig = await setupConfig(["cpy", "/Users/mockUser/pgm"]);
    const testUri = UriUtils.toUri("/Users/mockUser/pgm/ext-pgm.pli");
    const config = pluginConfig.getProcessGroupConfigFromLib(testUri);

    expect(config).toBeDefined();
  });
});
