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
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { PluginConfigurationProvider } from "../../src/workspace/plugin-configuration-provider";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import { commandCreateConfig } from "../../src/language-server/commands";
import { Commands } from "../../src/language-server/constants";
import { UriUtils } from "../../src/utils/uri";
import { updateOrCreateConfig } from "../../src/utils/config";
import { makeProgramConfig } from "../config-fixtures";

const WORKSPACE_PATH = UriUtils.toUri("/workspace");
const CONFIG_FILE_PATH = UriUtils.toUri("/workspace/.pliplugin/pgm_conf.json");

const INITIAL_PROGRAM_RAW = { program: "a.pli", pgroup: "default" };
const INITIAL_PROGRAM = makeProgramConfig(INITIAL_PROGRAM_RAW);
const INITIAL_CONFIG = JSON.stringify({ pgms: [INITIAL_PROGRAM_RAW] }, null, 2);

describe("commandCreateConfig", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;
  let workspace: WorkspaceContext;

  beforeEach(async () => {
    vfs = new VirtualFileSystemProvider();
    workspace = new WorkspaceContext(WORKSPACE_PATH, vfs);
    pluginConfig = workspace.config;
    await pluginConfig.init(WORKSPACE_PATH);
  });

  test("appends a new program to an existing config file", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await commandCreateConfig(
      {
        command: Commands.CREATE_CONFIG,
        arguments: ["b.pli"],
      },
      workspace,
    );

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "b.pli", pgroup: "default" },
      ],
    });
  });
  test("appends a new nested program to an existing config file", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await commandCreateConfig(
      {
        command: Commands.CREATE_CONFIG,
        arguments: ["nested/b.pli"],
      },
      workspace,
    );
    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "nested/b.pli", pgroup: "default" },
      ],
    });
  });

  test("creates a new config file when none exists", async () => {
    await commandCreateConfig(
      {
        command: Commands.CREATE_CONFIG,
        arguments: ["a.pli"],
      },
      workspace,
    );

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
  });
});

describe("updateOrCreateConfig", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;
  let workspace: WorkspaceContext;

  beforeEach(async () => {
    vfs = new VirtualFileSystemProvider();
    workspace = new WorkspaceContext(WORKSPACE_PATH, vfs);
    pluginConfig = workspace.config;
    await pluginConfig.init(WORKSPACE_PATH);
  });

  test("appends workspace-internal program to existing config file", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await updateOrCreateConfig("/workspace/entryProgram.pli", workspace);

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "/workspace/entryProgram.pli", pgroup: "default" },
      ],
    });
  });

  test("appends external program from outside workspace to existing config file", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await updateOrCreateConfig(
      "/Users/mockUser/anotherWorkspace/entryProgram.pli",
      workspace,
    );

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
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
      workspace,
    );

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
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
    await updateOrCreateConfig("/workspace/entryProgram.pli", workspace);

    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "/workspace/entryProgram.pli", pgroup: "default" }],
    });
  });

  test("throws error when initial config file creation fails", async () => {
    // Mock writeProgramConfigFile to fail
    pluginConfig.writeProgramConfigFile = vi
      .fn()
      .mockRejectedValue(new Error("Write failed"));

    await expect(updateOrCreateConfig("test.pli", workspace)).rejects.toThrow(
      "Write failed",
    );
  });

  test("throws error when program config file creation fails for existing configs", async () => {
    // Set up existing configs but no file
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock writeProgramConfigFile to fail
    pluginConfig.writeProgramConfigFile = vi
      .fn()
      .mockRejectedValue(new Error("Permission denied"));

    await expect(updateOrCreateConfig("test.pli", workspace)).rejects.toThrow(
      "Permission denied",
    );
  });

  test("returns early when config file exists but readFile returns null/undefined", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock readFile to return null
    const originalRead = vfs.readFile.bind(vfs);
    vfs.readFile = vi.fn().mockResolvedValue(null);

    await updateOrCreateConfig("test.pli", workspace);

    // Verify no changes were made (file should still have initial content)
    vfs.readFile = originalRead;
    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(JSON.parse(result!)).toEqual({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
  });

  test("returns early when config file has invalid structure", async () => {
    // Write invalid config structure (missing pgms array)
    await vfs.writeFile(
      CONFIG_FILE_PATH,
      JSON.stringify({ invalid: "structure" }, null, 2),
    );
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli", workspace);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );

    // Verify file was not modified
    const result = await workspace.fs.readFile(CONFIG_FILE_PATH);
    expect(JSON.parse(result!)).toEqual({ invalid: "structure" });
  });

  test("returns early when config file contains null", async () => {
    // Write null as config content
    await vfs.writeFile(CONFIG_FILE_PATH, "null");
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli", workspace);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );
  });

  test("returns early when config file has non-array pgms field", async () => {
    // Write config with pgms as non-array
    await vfs.writeFile(
      CONFIG_FILE_PATH,
      JSON.stringify({ pgms: "not-an-array" }, null, 2),
    );
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await updateOrCreateConfig("test.pli", workspace);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected format in program config file",
    );
  });

  test("throws error when reading or updating config file fails", async () => {
    await vfs.writeFile(CONFIG_FILE_PATH, INITIAL_CONFIG);
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    // Mock readFile to throw an error
    vfs.readFile = vi.fn().mockRejectedValue(new Error("Read failed"));

    await expect(updateOrCreateConfig("test.pli", workspace)).rejects.toThrow(
      "Read failed",
    );
  });

  test("throws error when JSON.parse fails on malformed config", async () => {
    // Write malformed JSON
    await vfs.writeFile(CONFIG_FILE_PATH, "{ invalid json }");
    await pluginConfig.setProgramConfigs(WORKSPACE_PATH, [INITIAL_PROGRAM]);

    await expect(updateOrCreateConfig("test.pli", workspace)).rejects.toThrow();
  });
});
