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
  FileSystemProviderInstance,
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src/workspace/file-system-provider";

import {
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { commandCreateConfig } from "../../src/language-server/commands";
import { Commands } from "../../src/language-server/constants";
import { URI } from "../../src/utils/uri";
import { updateOrCreateConfig } from "../../src/utils/config";

const WORKSPACE_PATH = "/workspace";
const CONFIG_FILE_PATH = "/workspace/.pliplugin/pgm_conf.json";

const INITIAL_PROGRAM = { program: "a.pli", pgroup: "default" };
const INITIAL_CONFIG = JSON.stringify({ pgms: [INITIAL_PROGRAM] }, null, 2);

/**
 * COMMAND CREATE CONFIG
 */
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

  test("appends a new program to an existing config file", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await commandCreateConfig({
      command: Commands.CREATE_CONFIG,
      arguments: ["b.pli"],
    });

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "b.pli", pgroup: "default" },
      ],
    });
  });
  test("appends a new nested program to an existing config file", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await commandCreateConfig({
      command: Commands.CREATE_CONFIG,
      arguments: ["nested/b.pli"],
    });
    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "nested/b.pli", pgroup: "default" },
      ],
    });
  });

  test("creates a new config file when none exists", async () => {
    await commandCreateConfig({
      command: Commands.CREATE_CONFIG,
      arguments: ["a.pli"],
    });

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
  });
});

/**
 * UPDATE OR CREATE CONFIG
 */
describe("updateOrCreateConfig", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;

  beforeEach(async () => {
    vfs = new VirtualFileSystemProvider();
    pluginConfig = new PluginConfigurationProvider();
    setFileSystemProvider(vfs);
    setPluginConfigurationProvider(pluginConfig);
    await pluginConfig.init(WORKSPACE_PATH);
  });

  test("appends workspace-internal program to existing config file", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await updateOrCreateConfig("/workspace/entryProgram.pli");

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "/workspace/entryProgram.pli", pgroup: "default" },
      ],
    });
  });

  test("appends external program from outside workspace to existing config file", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await updateOrCreateConfig(
      "/Users/mockUser/anotherWorkspace/entryProgram.pli",
    );

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        {
          program: "/Users/mockUser/anotherWorkspace/entryProgram.pli",
          pgroup: "default",
        },
      ],
    });
  });

  test("creates new config file with external program when no configuration exists", async () => {
    await updateOrCreateConfig(
      "/Users/mockUser/anotherWorkspace/entryProgram.pli",
    );

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        {
          program: "/Users/mockUser/anotherWorkspace/entryProgram.pli",
          pgroup: "default",
        },
      ],
    });
  });

  test("creates new config file with workspace-internal program when no configuration exists", async () => {
    await updateOrCreateConfig("/workspace/entryProgram.pli");

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "/workspace/entryProgram.pli", pgroup: "default" }],
    });
  });
});
