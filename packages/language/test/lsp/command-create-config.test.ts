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

import { beforeEach, describe, expect, test } from "vitest";
import {
  URI,
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src";
import {
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { commandCreateConfig } from "../../src/language-server/commands";
import { Commands } from "../../src/language-server/constants";

const WORKSPACE_PATH = "/workspace";
const CONFIG_FILE_PATH = "/workspace/.pliplugin/pgm_conf.json";

const INITIAL_PROGRAM = { program: "a.pli", pgroup: "default" };
const INITIAL_CONFIG = JSON.stringify({ pgms: [INITIAL_PROGRAM] }, null, 2);

describe("commandCreateConfig", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;

  beforeEach(async () => {
    vfs = new VirtualFileSystemProvider();
    pluginConfig = new PluginConfigurationProvider();
    setFileSystemProvider(vfs);
    setPluginConfigurationProvider(pluginConfig);
    await pluginConfig.init(WORKSPACE_PATH);
  });

  (test("appends a new program to an existing config file", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const result = await commandCreateConfig(
      {
        command: Commands.CREATE_CONFIG,
        arguments: ["b.pli"],
      },
      true,
    );

    expect(result).toBeDefined();
    expect(JSON.parse(JSON.parse(result!))).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "b.pli", pgroup: "default" },
      ],
    });
  }),
    test("appends a new nested program to an existing config file", async () => {
      await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
      await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

      const result = await commandCreateConfig(
        {
          command: Commands.CREATE_CONFIG,
          arguments: ["nested/b.pli"],
        },
        true,
      );

      expect(result).toBeDefined();
      expect(JSON.parse(JSON.parse(result!))).toEqual({
        pgms: [
          { program: "a.pli", pgroup: "default" },
          { program: "nested/b.pli", pgroup: "default" },
        ],
      });
    }));

  test("creates a new config file when none exists", async () => {
      const result = await commandCreateConfig(
        {
          command: Commands.CREATE_CONFIG,
          arguments: ["a.pli"],
        },
        true,
      );

      expect(result).toBeDefined();
      expect(JSON.parse(JSON.parse(result!))).toEqual({
        pgms: [
          { program: "a.pli", pgroup: "default" }
        ],
      });
    });
});
