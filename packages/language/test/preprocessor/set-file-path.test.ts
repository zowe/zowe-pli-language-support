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
import { describe, test, expect, beforeEach } from "vitest";
import {
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI, UriUtils } from "../../src/utils/uri";
import path from "path";

describe("setFilePath", () => {
  let pluginConfig: PluginConfigurationProvider;
  let workspaceRoot: string;

  beforeEach(async () => {
    pluginConfig = new PluginConfigurationProvider();
    setPluginConfigurationProvider(pluginConfig);

    workspaceRoot = path.resolve("Users/mockUser/workspace");
    await pluginConfig.init(workspaceRoot);
  });

  test("returns absolute path when target file resolves to absolute (outside workspace rules)", async () => {
    const absolutePath = path.resolve("/absolute-folder/absolute.pli");
    const abstFile = URI.file(absolutePath);
    const actualPath = UriUtils.relativeDisplayPath(
      workspaceRoot,
      abstFile.path,
    );
    // This const returns the correct drive letter for different windows environments.
    const absolutePathDriveLetter =
      process.platform === "win32"
        ? (absolutePath.match(/^[A-Za-z]:/)?.[0] ?? "")
        : "";

    const expected = ["darwin", "linux"].includes(process.platform)
      ? `/absolute-folder/absolute.pli`
      : `${absolutePathDriveLetter}/absolute-folder/absolute.pli`;

    expect(actualPath).toBe(expected);
  });

  test("returns './file.pli' when file is directly under workspace root", async () => {
    const relPath = path.join(workspaceRoot, "relative.pli");
    const relFile = URI.file(relPath);
    const actualPath = UriUtils.relativeDisplayPath(
      workspaceRoot,
      relFile.path,
    );
    expect(actualPath).toBe("./relative.pli");
  });

  test("returns './nested/file.pli' for a nested file in workspace", async () => {
    const nestedPath = path.join(
      workspaceRoot,
      "nested",
      "relative-nested.pli",
    );
    const nestedFile = URI.file(nestedPath);
    const actualPath = UriUtils.relativeDisplayPath(
      workspaceRoot,
      nestedFile.path,
    );
    expect(actualPath).toBe("./nested/relative-nested.pli");
  });
});
