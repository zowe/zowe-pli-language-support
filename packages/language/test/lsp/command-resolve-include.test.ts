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
  deserializeProcessGroup,
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { commandResolveInclude } from "../../src/language-server/commands";
import { Commands } from "../../src/language-server/constants";
import { URI } from "../../src/utils/uri";

const WORKSPACE_PATH = "/workspace";
const CONFIG_FILE_PATH = "/workspace/.pliplugin/proc_grps.json";

describe("commandResolveInclude", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;

  beforeEach(async () => {
    vfs = new VirtualFileSystemProvider();
    pluginConfig = new PluginConfigurationProvider();
    setFileSystemProvider(vfs);
    setPluginConfigurationProvider(pluginConfig);
    await pluginConfig.init(WORKSPACE_PATH);

    // Base config setup
    const processGroup = deserializeProcessGroup({
      name: "default",
      libs: [],
    });

    await pluginConfig.setProcessGroupConfigs([processGroup]);
  });

  test("Appends a new lib to the process group configuration.", async () => {
    await commandResolveInclude({
      command: Commands.RESOLVE_INCLUDE,
      arguments: [
        CONFIG_FILE_PATH,
        JSON.stringify({
          name: "default",
          libs: ["cpy"],
        }),
      ],
    });

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      name: "default",
      libs: ["cpy"],
    });
  });

  test("Appends a new lib from an absolute file path to the process group configuration.", async () => {
    await commandResolveInclude({
      command: Commands.RESOLVE_INCLUDE,
      arguments: [
        CONFIG_FILE_PATH,
        JSON.stringify({
          name: "default",
          libs: ["/Users/mockUser/mockWorkspace"],
        }),
      ],
    });

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      name: "default",
      libs: ["/Users/mockUser/mockWorkspace"],
    });
  });

  test("Handles content with special characters and escaping.", async () => {
    await commandResolveInclude({
      command: Commands.RESOLVE_INCLUDE,
      arguments: [
        CONFIG_FILE_PATH,
        JSON.stringify({
          name: "default",
          libs: ["path/with spaces", "path\\with\\backslashes"],
        }),
      ],
    });

    const result = await FileSystemProviderInstance.readFile(
      URI.parse(CONFIG_FILE_PATH),
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result!)).toEqual({
      name: "default",
      libs: ["path/with spaces", "path\\with\\backslashes"],
    });
  });

  test("Does not throw when write fails (error is logged instead).", async () => {
    // Mock writeFile to throw an error
    const originalWriteFile = vfs.writeFile.bind(vfs);
    vfs.writeFile = vi.fn().mockRejectedValue(new Error("Permission denied"));

    await expect(
      commandResolveInclude({
        command: Commands.RESOLVE_INCLUDE,
        arguments: [
          CONFIG_FILE_PATH,
          JSON.stringify({ name: "default", libs: [] }),
        ],
      }),
    ).resolves.toBeUndefined();

    // Restore original
    vfs.writeFile = originalWriteFile;
  });

  test("Logs error message with correct URI when write fails.", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const originalWriteFile = vfs.writeFile.bind(vfs);
    vfs.writeFile = vi.fn().mockRejectedValue(new Error("Write failed"));

    await commandResolveInclude({
      command: Commands.RESOLVE_INCLUDE,
      arguments: [
        CONFIG_FILE_PATH,
        JSON.stringify({ name: "default", libs: [] }),
      ],
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to write file at URI: ${CONFIG_FILE_PATH}`,
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
    vfs.writeFile = originalWriteFile;
  });
});
