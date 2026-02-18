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

import { beforeEach, describe, expect, test, vi } from "vitest";
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

  test("throws error when initial config file creation fails", async () => {
    // Mock writeProgramConfigFile to fail
    const originalWrite =
      pluginConfig.writeProgramConfigFile.bind(pluginConfig);
    pluginConfig.writeProgramConfigFile = vi
      .fn()
      .mockRejectedValue(new Error("Write failed"));

    await expect(updateOrCreateConfig("test.pli")).rejects.toThrow(
      "Write failed",
    );

    // Restore
    pluginConfig.writeProgramConfigFile = originalWrite;
  });

  test("throws error when program config file creation fails for existing configs", async () => {
    // Set up existing configs but no file
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock writeProgramConfigFile to fail
    const originalWrite =
      pluginConfig.writeProgramConfigFile.bind(pluginConfig);
    pluginConfig.writeProgramConfigFile = vi
      .fn()
      .mockRejectedValue(new Error("Permission denied"));

    await expect(updateOrCreateConfig("test.pli")).rejects.toThrow(
      "Permission denied",
    );

    // Restore
    pluginConfig.writeProgramConfigFile = originalWrite;
  });

  test("returns early when config file exists but readFile returns null/undefined", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock readFile to return null
    const originalRead = vfs.readFile.bind(vfs);
    vfs.readFile = vi.fn().mockResolvedValue(null);

    await updateOrCreateConfig("test.pli");

    // Verify no changes were made (file should still have initial content)
    vfs.readFile = originalRead;
    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
  });

  test("returns early when config file has invalid structure", async () => {
    // Write invalid config structure (missing pgms array)
    await vfs.writeFile(
      URI.parse(CONFIG_FILE_PATH),
      JSON.stringify({ invalid: "structure" }, null, 2),
    );
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );

    // Verify file was not modified
    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(JSON.parse(result!)).toEqual({ invalid: "structure" });

    consoleErrorSpy.mockRestore();
  });

  test("returns early when config file contains null", async () => {
    // Write null as config content
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), "null");
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );

    consoleErrorSpy.mockRestore();
  });

  test("returns early when config file has non-array pgms field", async () => {
    // Write config with pgms as non-array
    await vfs.writeFile(
      URI.parse(CONFIG_FILE_PATH),
      JSON.stringify({ pgms: "not-an-array" }, null, 2),
    );
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );

    consoleErrorSpy.mockRestore();
  });

  test("throws error when reading or updating config file fails", async () => {
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock readFile to throw an error
    const originalRead = vfs.readFile.bind(vfs);
    vfs.readFile = vi.fn().mockRejectedValue(new Error("Read failed"));

    await expect(updateOrCreateConfig("test.pli")).rejects.toThrow(
      "Read failed",
    );

    // Restore
    vfs.readFile = originalRead;
  });

  test("throws error when JSON.parse fails on malformed config", async () => {
    // Write malformed JSON
    await vfs.writeFile(URI.parse(CONFIG_FILE_PATH), "{ invalid json }");
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await expect(updateOrCreateConfig("test.pli")).rejects.toThrow();
  });
});
